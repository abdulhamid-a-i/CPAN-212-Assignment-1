import crypto from "crypto";
import { nowIso } from "../utils/time.js";

export function withRequestId(handler) {
  return async (req, res) => {
    const reqId = crypto.randomUUID();
    const start = nowIso();

    res.setHeader("X-Request-Id", reqId);
    res.startTime = start;

    console.log(`[${nowIso()}] START ${reqId} ${req.method} ${req.url}`);
    next();
  };
}