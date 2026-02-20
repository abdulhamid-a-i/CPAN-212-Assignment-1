import { nowIso } from "../utils/time.js";
import crypto from "crypto";

export async function requestLog(req, res, next){
    const reqId = crypto.randomUUID();
    const start = nowIso();

    res.setHeader('X-Request-Id', reqId);
    res.startTime = start;

    console.log(`[${nowIso()}] START ${reqId} ${req.method} ${req.url}`);

    res.on("finish", () => {
      const ms = Date.now() - start;
      console.log(`[${nowIso()}] END  ${reqId} ${req.method} ${req.url} ${res.statusCode} ${ms}ms`);
    });
  
  next();

}