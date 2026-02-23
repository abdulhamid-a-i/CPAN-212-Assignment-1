// frontend/pages/bulk_upload.tsx
import { useState } from "react";
import ErrorBanner from "../components/ErrorBanner";
import { bulkUploadCsv } from "../services/api";
import CsvUpload from "../components/CsvUpload";
import Layout from "../components/Layout";
import UploadResult from "../components/UploadResult";

type UploadResult = {
  totalRows: number;
  created: number;
  skipped: number;
  rowErrors?: { row: number; errors: string[] }[];
};

type UploadError = {
  message: string;
  requestId?: string;
};

export default function BulkUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [err, setErr] = useState<UploadError | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (data) => {
    setFile(data)
  }

  async function onUpload() {
    if (!file) {
      setErr({ message: "Please select a CSV file." });
      return;
    }

    try {
      setUploading(true);
      setErr(null);
      setResult(null);

      const data = await bulkUploadCsv(file);
      setResult(data.data);
    } catch (e: any) {
      setErr({
        message: e.message || "Something went wrong.",
        requestId: e.requestId,
      });
    } finally {
      setUploading(false);
    }
  }

  return (
    <Layout title="Bulk Upload">
      <div className="container">
      <h1>Upload CSV</h1>
      <ErrorBanner error={err} />

      <div className="info">
        Required headers: <code>title,description,department,priority,requesterName,assignee</code>
      </div>


      <div className="upload-controls">
        <CsvUpload onFileSelect={handleFileSelect}/>
        <button onClick={onUpload} disabled={!file || uploading}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {result && (
        <UploadResult result={result}/>
      )}
    </div>
    </Layout>
    
  );
}