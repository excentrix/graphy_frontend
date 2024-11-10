import React, { useState } from "react";

interface DataManipulationProps {
  uploadedFiles: string[];
}

const DataManipulation: React.FC<DataManipulationProps> = ({
  uploadedFiles,
}) => {
  const [filename, setFilename] = useState<string | undefined>(undefined);
  const [filterColumn, setFilterColumn] = useState<string>("");
  const [filterValue, setFilterValue] = useState<string>("");
  const [selectedColumns, setSelectedColumns] = useState<string>("");
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleManipulate = async () => {
    if (!filename) {
      alert("Please select a file to manipulate.");
      return;
    }

    const queryParams = new URLSearchParams({
      filename,
      filter_column: filterColumn || "",
      filter_value: filterValue || "",
      columns: selectedColumns || "",
    }).toString();

    try {
      setIsLoading(true);
      const response = await fetch(
        `http://127.0.0.1:8000/manipulate?${queryParams}`
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error manipulating data:", error);
      alert("Failed to manipulate data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="data-manipulation-container border p-4 mt-6 rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-4">Manipulate Uploaded Data</h2>
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Select Filename:</label>
        <select
          value={filename || ""}
          onChange={(e) => setFilename(e.target.value)}
          className="border rounded p-2 w-full"
        >
          <option value="">Select file</option>
          {uploadedFiles &&
            uploadedFiles.length > 0 &&
            uploadedFiles.map((file) => (
              <option key={file} value={file}>
                {file}
              </option>
            ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Filter Column:</label>
        <input
          type="text"
          value={filterColumn}
          onChange={(e) => setFilterColumn(e.target.value)}
          className="border rounded p-2 w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Filter Value:</label>
        <input
          type="text"
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          className="border rounded p-2 w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-semibold">
          Columns to Select (comma-separated):
        </label>
        <input
          type="text"
          value={selectedColumns}
          onChange={(e) => setSelectedColumns(e.target.value)}
          className="border rounded p-2 w-full"
        />
      </div>
      <button
        onClick={handleManipulate}
        disabled={isLoading}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {isLoading ? "Processing..." : "Manipulate Data"}
      </button>
      {result && result.preview && (
        <div className="result-container mt-6">
          <h3 className="text-lg font-bold">Manipulated Data Preview:</h3>
          <pre className="bg-gray-100 p-4 rounded mt-2">
            {JSON.stringify(result.preview, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default DataManipulation;
