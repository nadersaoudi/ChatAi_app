"use client";
import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";

const PdfRagPanel: React.FC = () => {
  const { user } = useUser();
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [query, setQuery] = useState("");
  const [ragResults, setRagResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPdfFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!user || !pdfFile) return;
    setUploadStatus("Uploading...");
    const formData = new FormData();
    formData.append("user_id", user.id);
    formData.append("file", pdfFile);
    try {
      const res = await fetch("http://localhost:8000/api/upload_pdf", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setUploadStatus(`Uploaded! Chunks: ${data.chunks}`);
      } else {
        setUploadStatus("Upload failed");
      }
    } catch (err) {
      setUploadStatus("Upload error");
    }
  };

  const handleQuery = async () => {
    if (!user || !query) return;
    setLoading(true);
    setRagResults([]);
    const formData = new FormData();
    formData.append("user_id", user.id);
    formData.append("query", query);
    try {
      const res = await fetch("http://localhost:8000/api/query_rag", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setRagResults(data.results || []);
    } catch (err) {
      setRagResults(["Error fetching RAG results"]);
    }
    setLoading(false);
  };

  return (
    <div className="bg-neutral-800 p-6 rounded-xl mb-6">
      <h2 className="text-white text-xl mb-4">PDF RAG Panel</h2>
      <div className="mb-4">
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
        <button
          className="ml-2 px-4 py-2 bg-neutral-600 text-white rounded hover:bg-neutral-700"
          onClick={handleUpload}
          disabled={!pdfFile || !user}
        >
          Upload PDF
        </button>
        <span className="ml-4 text-neutral-300">{uploadStatus}</span>
      </div>
      <div className="mb-4">
        <input
          type="text"
          className="px-3 py-2 rounded bg-neutral-700 text-white w-80"
          placeholder="Ask a question about your PDFs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className="ml-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={handleQuery}
          disabled={!query || !user}
        >
          Ask
        </button>
      </div>
      {loading && <div className="text-neutral-400">Loading...</div>}
      {ragResults.length > 0 && (
        <div className="bg-neutral-900 p-4 rounded">
          <h3 className="text-white mb-2">RAG Results:</h3>
          <ul className="list-disc pl-6">
            {ragResults.map((res, idx) => (
              <li key={idx} className="text-neutral-300 mb-2 whitespace-pre-line">{res}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PdfRagPanel; 