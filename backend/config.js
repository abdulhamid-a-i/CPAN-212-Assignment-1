import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const PORT = process.env.PORT || 3001;

export const STORAGE_MODE = "async";

export const BACKEND_DIR = path.resolve(__dirname, ".");

export const PATHS = {
    DATA_DIR: path.join(BACKEND_DIR, "src","data"),
    INCIDENTS_INDEX: path.join(BACKEND_DIR,"src","store","data","incidents.json")
};

export const LIMITS = {
  MAX_CSV_BYTES: 200_000
};

export const ENUMS = {
  DEPARTMENTS: ["IT", "SAFETY", "FACILITIES", "OTHER"],
  PRIORITY: ["LOW", "MEDIUM", "HIGH"],
  STATUS: ["NEW", "IN_PROGRESS", "BLOCKED", "DONE"]
  
};

export const TRANSITIONS = {
    NEW: ["IN_PROGRESS"],
    IN_PROGRESS: ["DONE", "BLOCKED"],
    BLOCKED: ["IN_PROGRESS"],
    DONE:[]
};
