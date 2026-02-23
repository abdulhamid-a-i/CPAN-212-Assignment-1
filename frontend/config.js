export const API_BASE_URL = "http://localhost:3001";

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