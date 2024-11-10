"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { DataTable } from "./data-table";

const FileUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadResponse, setUploadResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [tableData, setTableData] = React.useState([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event.target.files?.[0] || null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setIsLoading(true);
      const response = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      // Only read the response body once
      const data = await response.json();
      setUploadResponse(data);
      setTableData(data.dataframe);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };


  const handleDataChange = (newData: any) => {
    setTableData((prev) => newData);
    // You can also send the updates to your backend here
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full flex gap-3 m-4">
        <Input type="file" onChange={handleFileChange} accept=".csv, .xlsx" />
        <Button onClick={handleUpload} disabled={isLoading}>
          {isLoading ? "Uploading..." : "Upload File"}
        </Button>
      </div>

      {uploadResponse && (
        <div className="max-w-full w-full p-2 space-y-4">
          <DataTable
            // filename={uploadResponse?.filename}
            onDataChange={handleDataChange}
            columns={uploadResponse?.columns}
            initialData={uploadResponse?.dataframe}
          />
        </div>
      )}
    </div>
  );
};

export default FileUpload;
