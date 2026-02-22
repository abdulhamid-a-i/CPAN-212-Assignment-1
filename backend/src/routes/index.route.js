import express from "express";
import { nowIso } from "../utils/time.js";
import { sendJson } from "../middleware/response.middleware.js";


const router = express.Router();


router.get("/health", async (req, res) => {
    const timeISO = nowIso();
  sendJson(res, 200, req.requestId, {status: "ok", time: timeISO})
});

export default router;