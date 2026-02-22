import express from "express";
import { nowIso } from "../utils/time";
import { sendJson } from "../middleware/response.middleware";


const router = express.Router();


router.get("/", async (req, res) => {
    const timeISO = nowIso();
  sendJson(res, 200, req.requestId, {status: "ok", time: timeISO})
});