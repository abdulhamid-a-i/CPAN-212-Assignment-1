import express from "express";
import multer from "multer";


import { parseCsvBuffer } from "../utils/csv.js";
import { validateCreateWorkorder, validateStatusChange } from "../utils/validate.js";
import { sendJson } from "../middleware/response.middleware.js";
import { AppError } from "../utils/apperror.js";


const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.get("/", async (req, res) => {
  // Will accept parameters like dep (look at lab 2)
  
  const {status, department, priority, assignee, page, limit} = req.query;
  const workOrders = await workOrderService.list({
    status: status || null,
    department: department || null,
    priority: priority || null,
    assignee: assignee || null,
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 10,
  })

  return sendJson(res, 200, req.requestId, workOrders)
});

router.get("/:id", async (req, res, next) => {
  const workOrder = await workOrderService.findById(req.params.id);
  if(!workOrder) return next(new AppError)

});

router.post("/", async (req, res) => {

});

router.patch("/:id/status", async (req, res) => {

});

router.post("/bulk-upload", upload.single("file"), async (req, res, next) => {
  const errors = []
  const records = await parseCsvBuffer(req.file.buffer);

  let created = 0;
  let skipped = 0;

  for (const row of records){
    const result = validateCreateWorkorder(row);
    if (!result.ok) {
      result.errors.array.forEach(err => {
        errors.push({
          row: row,
          field: err.field,
          reason: err.reason
        })
      });
      skipped++;
      continue
    }
    await createWorkorder(result.value);
    created++;
  }
  sendJson(res, 201, req.requestId, {
    uploadId: req.requestId,
    strategy: "PARTIAL_ACCEPTANCE",
    totalRows: records.length,
    accepted: created,
    rejected: skipped
  })
  /*res.json({
    totalRows: records.length,
    created,
    skipped
  });*/
});

export default router;
