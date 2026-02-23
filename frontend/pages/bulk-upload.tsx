// frontend/pages/bulk_upload.tsx
import { useState } from "react";
import ErrorBanner from "../components/ErrorBanner";
import { bulkUploadCsv } from "../services/api";
import CsvUpload from "../components/CsvUpload";
import Layout from "../components/Layout";

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
      <h1>Bulk Upload CSV</h1>
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
        <div className="result">
          <h2>Result</h2>
          <div>
            <div><strong>Total Rows:</strong> {result.totalRows}</div>
            <div><strong>Created:</strong> {result.created}</div>
            <div><strong>Skipped:</strong> {result.skipped}</div>
          </div>

          {Array.isArray(result.rowErrors) && result.rowErrors.length > 0 && (
            <>
              <h3>Skipped Row Errors</h3>
              <table>
                <thead>
                  <tr>
                    <th>Row</th>
                    <th>Errors</th>
                  </tr>
                </thead>
                <tbody>
                  {result.rowErrors.map((r, idx) => (
                    <tr key={idx}>
                      <td>{r.row}</td>
                      <td>{(r.errors || []).join(", ")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      )}
    </div>
    </Layout>
    
  );
}