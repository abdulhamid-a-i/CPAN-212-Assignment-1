import { API_BASE_URL } from "../config";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || API_BASE_URL;


export async function bulkUploadCsv(file) {
  const fd = new FormData();
  fd.append("file", file);

  const res = await fetch(`${BASE}/api/incidents/bulk-upload`, {
    method: "POST",
    body: fd
  });

  return handleJson(res);
}