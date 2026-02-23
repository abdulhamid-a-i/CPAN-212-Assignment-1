import express from "express";
import multer from "multer";

import { parseCsvBuffer } from "../utils/csv.js";
import { bulkUpload, create, deleteById, findById, list, update, updateStatus } from "../controllers/workorders.controller.js";
import { LIMITS } from "../../config.js";
import { AppError } from "../utils/apperror.js";




const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.get("/", async (req, res, next) => {
  // Will accept parameters like dep (look at lab 2)
  list(req, res);
});

router.get("/:id", async (req, res, next) => {
  findById(req,res, next);
});

router.post("/", async (req, res, next) => {
  create(req, res, next);
});

router.patch("/:id", async(req, res, next) => {
  update(req, res, next);
})

router.patch("/:id/status", async (req, res, next) => {
  updateStatus(req, res, next);
});

router.post("/bulk-upload", upload.single("file"), async (req, res, next) => {
  if(!req.file){
    return next( new AppError(400, "VALIDATION_ERROR", "File cannot be null"));
  }
  if (req.file.buffer.length > LIMITS.MAX_CSV_BYTES){
    return next(new AppError(413,"PAYLOAD_TOO_LARGE", "File size exceeds maximum allowed file size"));
  }
  const records = await parseCsvBuffer(req.file.buffer);
  bulkUpload(req,res,next, records);
});

router.delete("/:id", async (req, res, next) => {
  deleteById(req, res, next);
})

export default router;
