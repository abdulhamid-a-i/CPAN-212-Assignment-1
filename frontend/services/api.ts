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
    const details = body && body.error.details ? body.error.details : null;
    const err = new Error(body.error.message);
    err.status = res.status;
    err.details = details;
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

export async function listWorkOrders(query = {}) {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, String(value));
    }
  });

  const qs = params.toString() ? `?${params.toString()}` : "";

  const res = await fetch(`${BASE}/api/workorders${qs}`, {
    method: "GET",
    headers: HEADERS_JSON,
  });

  return handleJson(res);
}

export async function getWorkOrder(id: string) {
  const res = await fetch(`${BASE}/api/workorders/${encodeURIComponent(id)}`, {
    method: "GET",
    headers: HEADERS_JSON,
  });

  return handleJson(res);
}

export async function changeWorkOrderStatus(id: string, status: string) {
  const res = await fetch(`${BASE}/api/workorders/${encodeURIComponent(id)}/status`, {
    method: "PATCH",
    headers: HEADERS_JSON,
    body: JSON.stringify({ status }),
  });

  return handleJson(res);
}

//Cheyenne's Code Below

export async function createWorkOrder(payload: any) {
  const res = await fetch(`${BASE}/api/workorders`, {
    method: "POST",
    headers: HEADERS_JSON,
    body: JSON.stringify(payload),
  });
  return handleJson(res);
}

export async function updateWorkOrder(id: string, payload: any) {
  const res = await fetch(`${BASE}/api/workorders/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: HEADERS_JSON,
    body: JSON.stringify(payload),
  });
  return handleJson(res);
}

export async function deleteWorkOrder(id: string) {
  const res = await fetch(`${BASE}/api/workorders/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: HEADERS_JSON,
  });

  if (res.status === 204) return null;

  return handleJson(res);
}