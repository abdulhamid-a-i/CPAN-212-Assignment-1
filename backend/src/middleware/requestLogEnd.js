import { nowIso } from "../utils/time.js";

export const requestLog = (req, res, next) => {
    req.startTime= nowIso();
    console.log(`[${nowIso()}] START ${req.X-Request-Id} ${req.method} ${req.url}`);

    res.on("finish", () => {
      const ms = Date.now() - start;
      console.log(`[${nowIso()}] END   ${req.X-Request-Id} ${req.method} ${req.url} ${res.statusCode} ${ms}ms`);
    });
  
  next();

}