import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  //   getSortingRowModel,
  SortingState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

type DynamicData = {
  [key: string]: string | number | boolean | null;
  id: string;
};

interface DataTableProps {
  initialData: DynamicData[];
  columns: string[];
  onDataChange?: (newData: DynamicData[]) => void;
}

const EditableCell = React.memo(
  ({
    getValue,
    row,
    column,
    table,
  }: {
    getValue: () => any;
    row: { id: string; original: DynamicData };
    column: { id: string };
    table: any;
  }) => {
    const initialValue = getValue();
    const [isEditing, setIsEditing] = React.useState(false);
    const [value, setValue] = React.useState<any>(initialValue);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const valueType =
      typeof initialValue === "boolean"
        ? "boolean"
        : typeof initialValue === "number"
        ? "number"
        : "string";

    React.useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    const onValueChange = (newValue: any) => {
      table.options.meta?.updateData(row.id, column.id, newValue);
    };

    const onBlur = () => {
      setIsEditing(false);
      if (value !== initialValue) {
        let finalValue = value;
        if (valueType === "number" && value === "") {
          finalValue = null;
        }
        onValueChange(finalValue);
      }
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        inputRef.current?.blur();
      }
      if (e.key === "Escape") {
        setValue(initialValue);
        setIsEditing(false);
      }
    };

    if (valueType === "boolean") {
      return (
        <div className="flex items-center justify-center h-full">
          <Checkbox
            checked={Boolean(value)}
            onCheckedChange={(checked) => {
              onValueChange(checked);
            }}
            className="h-4 w-4"
          />
        </div>
      );
    }

    return (
      <div
        className={cn(
          "w-full h-full min-h-[2rem]",
          !isEditing && "cursor-pointer hover:bg-muted/50"
        )}
        onClick={() => !isEditing && setIsEditing(true)}
      >
        {isEditing ? (
          <Input
            ref={inputRef}
            type={valueType === "number" ? "number" : "text"}
            value={value?.toString() ?? ""}
            onChange={(e) => {
              let newValue: string | number = e.target.value;
              if (valueType === "number") {
                newValue = e.target.value === "" ? "" : Number(e.target.value);
              }
              setValue(newValue);
            }}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            className="h-8 w-full border-0 focus:ring-2"
            autoFocus
          />
        ) : (
          <div className="px-2 py-1">{value?.toString() ?? ""}</div>
        )}
      </div>
    );
  }
);

EditableCell.displayName = "EditableCell";

export function DataTable({
  initialData,
  columns,
  onDataChange,
}: DataTableProps) {
  const [data, setData] = React.useState<DynamicData[]>(initialData);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const updateData = React.useCallback(
    (rowId: string, columnId: string, value: any) => {
      setData((old) =>
        old.map((row) => {
          if (row.id === rowId) {
            return {
              ...row,
              [columnId]: value,
            };
          }
          return row;
        })
      );
    },
    []
  );

  React.useEffect(() => {
    onDataChange?.(data);
  }, [data, onDataChange]);

  const columnDefs = React.useMemo<ColumnDef<DynamicData>[]>(
    () =>
      columns.map((col) => ({
        accessorKey: col,
        header: col.charAt(0).toUpperCase() + col.slice(1),
        cell: ({ row, column, getValue }) => (
          <EditableCell
            getValue={getValue}
            row={row}
            column={column}
            table={table}
          />
        ),
      })),
    [columns]
  );

  const table = useReactTable({
    data,
    columns: columnDefs,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // getSortingRowModel: getSortingRowModel(),
    // onSortingChange: setSorting,
    // state: {
    //   sorting,
    // },
    meta: {
      updateData,
    },
  });

  const addNewRow = React.useCallback(() => {
    const newRow: DynamicData = {
      id: crypto.randomUUID(),
      ...Object.fromEntries(
        columns.map((col) => [
          col,
          typeof data[0]?.[col] === "boolean"
            ? false
            : typeof data[0]?.[col] === "number"
            ? null
            : "",
        ])
      ),
    };
    setData((old) => [...old, newRow]);
  }, [columns, data]);

  const deleteRow = React.useCallback((rowId: string) => {
    setData((old) => old.filter((row) => row.id !== rowId));
  }, []);

  return (
    <div className="space-y-4">
      <Button onClick={addNewRow}>Add New Row</Button>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
                <TableHead>Actions</TableHead>
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="p-0">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteRow(row.original.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex items-center space-x-2">
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm font-medium">Rows per page</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
