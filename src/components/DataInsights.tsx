// components/DataInsights.tsx
import React, { useState } from "react";

interface DataInsightsProps {
  uploadedFiles: string[];
}

const DataInsights: React.FC<DataInsightsProps> = ({ uploadedFiles }) => {
  const [filename, setFilename] = useState<string | undefined>(undefined);
  const [insights, setInsights] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleGenerateInsights = async () => {
    if (!filename) {
      alert("Please select a file to generate insights.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(
        `http://127.0.0.1:8000/insights?filename=${filename}`
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      setInsights(data);
    } catch (error) {
      console.error("Error generating insights:", error);
      alert("Failed to generate insights. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="data-insights-container border p-4 mt-6 rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-4">Generate Insights from Data</h2>
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
      <button
        onClick={handleGenerateInsights}
        disabled={isLoading}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {isLoading ? "Generating Insights..." : "Generate Insights"}
      </button>
      {insights && (
        <div className="insights-container mt-6">
          <h3 className="text-lg font-bold">Data Insights:</h3>
          <pre className="bg-gray-100 p-4 rounded mt-2">
            {JSON.stringify(insights, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default DataInsights;
