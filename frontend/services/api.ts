import { API_BASE_URL } from "../config";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || API_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY
const HEADERS_JSON = {
  "x-api-key": API_KEY,
  "Content-Type": "application/json"
}

const HEADERS_BULK = {
  "x-api-key": API_KEY,
}

async function handleJson(res) {
  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const body = isJson ? await res.json() : null;

  if (!res.ok) {
    const message =
      (body && (body.error || body.message)) ||
      `Request failed with status ${res.status}`;
    const details = body && body.error.details ? body.details : null;
    const err = new Error(body.error.message);
    err.status = res.status;
    err.details = body.error.details;
    throw err;
  }

  return body;
}


export async function bulkUploadCsv(file) {
  const fd = new FormData();
  fd.append("file", file);

  const res = await fetch(`${BASE}/api/workorders/bulk-upload`, {
    method: "POST",
    headers:HEADERS_BULK,
    body: fd
  });

  return handleJson(res);
}