import express from "express";
import multer from "multer";
import { bulkUpload, create, deleteById, findById, list, update, updateStatus } from "../controllers/workorders.controller.js";





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

router.put("/:id", async(req, res, next) => {
  update(req, res, next);
})

router.patch("/:id/status", async (req, res, next) => {
  updateStatus(req, res, next);
});

router.post("/bulk-upload", upload.single("file"), async (req, res, next) => {
  bulkUpload(req,res,next);
});

router.delete("/:id", async (req, res, next) => {
  deleteById(req, res, next);
})

export default router;
