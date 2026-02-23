import express from "express";
import multer from "multer";


import { parseCsvBuffer } from "../utils/csv.js";
import { validateCreateWorkOrder, validateStatusChange} from "../utils/validators.js";
import { sendJson } from "../middleware/response.middleware.js";
import { AppError } from "../utils/apperror.js";
import { bulkUpload, create, findById, list } from "../controllers/workorders.controller.js";
import { authRequest } from "../middleware/auth.middleware.js";



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

router.patch("/:id/status", async (req, res, next) => {

});

router.post("/bulk-upload", upload.single("file"), async (req, res, next) => {
  const records = await parseCsvBuffer(req.file.buffer);
  bulkUpload(req,res,next, records);

});

export default router;
