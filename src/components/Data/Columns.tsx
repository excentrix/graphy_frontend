"use client";

import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type DataColumn = {
  name: string;
};

export const columns: ColumnDef<DataColumn>[] = [];

