import express from "express";
import multer from "multer";

import { listAll, findById, createWorkorder, updateStatus } from "../store/workorders.store.js";
import { parseCsvBuffer } from "../utils/csv.js";
import { validateCreateWorkorder, validateStatusChange } from "../utils/validate.js";


const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.get("/", async (req, res) => {
  res.json(await listAll());
});

router.get("/:id", async (req, res) => {
  const workorder = await findById(req.params.id);
  if (!workorder) return res.status(404).json({ error: "Workorder not found" });
  res.json(workorder);
});

router.post("/", async (req, res) => {
  const result = await validateCreateWorkorder(req.body);
  if (!result.ok) {
    return res.status(400).json({ error: result.errors });
  }

  const workorder = await createWorkOrder(result.value);
  res.status(201).json(workorder);
});

router.patch("/:id/status", async (req, res) => {
  const workorder = await findById(req.params.id);
  if (!workorder) return res.status(404).json({ error: "Workorder not found" });

  const check = validateStatusChange(workorder.status, req.body.status);
  if (!check.ok) return res.status(400).json({ error: check.error });

  const updated = await updateStatus(workorder.id, check.next);
  res.json(updated);
});

router.post("/bulk-upload", upload.single("file"), async (req, res) => {
  const records = await parseCsvBuffer(req.file.buffer);

  let created = 0;
  let skipped = 0;

  for (const row of records){
    const result = validateCreateWorkorder(row);
    if (!result.ok) {
      skipped++;
      continue
    }
    await createWorkorder(result.value);
    created++;
  }

  res.json({
    totalRows: records.length,
    created,
    skipped
  });
});

export default router;
