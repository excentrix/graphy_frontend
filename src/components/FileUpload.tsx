"use client";
import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const FileUpload: React.FC<{ onUploadSuccess: (filename: string) => void }> = ({
  onUploadSuccess,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadResponse, setUploadResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
      onUploadSuccess(data.filename); // Notify parent of successful upload
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="file-upload-container">
      <Input type="file" onChange={handleFileChange} accept=".csv, .xlsx" />
      <Button onClick={handleUpload} disabled={isLoading}>
        {isLoading ? "Uploading..." : "Upload File"}
      </Button>

      {uploadResponse && (
        <div className="upload-response">
          <h3>Upload Successful!</h3>
          <p>
            <strong>Filename:</strong> {uploadResponse?.filename}
          </p>
          <p>
            <strong>Columns:</strong> {uploadResponse?.columns?.join(", ")}
          </p>
          <h4>Data Preview:</h4>
          <pre>{JSON.stringify(uploadResponse?.preview, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
