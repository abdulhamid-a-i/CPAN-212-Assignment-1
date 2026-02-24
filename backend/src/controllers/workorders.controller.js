import { workOrderService } from "../services/workorders.service.js";
import { sendJson } from "../middleware/response.middleware.js";
import { AppError } from "../utils/apperror.js";
import { validateCreateWorkOrder, validateUpdate, validateStatusChange, isCSV } from "../utils/validators.js";
import { createWorkOrder } from "../data/workorders.store.js";
import { LIMITS } from "../../config.js";
import { parseCsvBuffer } from "../utils/csv.js";

export async function list(req,res){
    
      const {status, department, priority, assignee, page, limit, q} = req.query;
      const workOrders = await workOrderService.list({
        status: status || null,
        department: department || null,
        priority: priority || null,
        assignee: assignee || null,
        q: q || null,
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
      })
    
      return sendJson(res, 200, req.requestId, workOrders)
}

export async function findById(req,res, next) {
      const workOrder = await workOrderService.findById(req.params.id);
      if(!workOrder) return next(new AppError(404, "NOT_FOUND", "Work order was not found"));
      sendJson(res, 200, req.requestId, workOrder); 
}

export async function create(req,res, next){
    const result = validateCreateWorkOrder(req.body);
    if (!result.ok){
        return next( new AppError(400, "VALIDATION_ERROR", "invalid workorder", result.errors));
    }
    const workOrder = await workOrderService.create(req.body);
    sendJson(res, 201, req.requestId, workOrder);

}

export async function update(req,res, next){
    const workOrder = await workOrderService.findById(req.params.id);
    if(!workOrder) return next( new AppError(404, "NOT_FOUND", "Work order was not found"));

    const result = validateUpdate(req.body);
    if (!result.ok){
        return next( new AppError(400, "VALIDATION_ERROR", "invalid workorder", result.errors));
    }
    const updatedWorkOrder = workOrderService.update(workOrder.id, req.body);
    sendJson(res, 201, req.requestId, updatedWorkOrder);

}

export async function updateStatus(req,res, next){
    const workOrder = await workOrderService.findById(req.params.id);
    if(!workOrder) return next( new AppError(404, "NOT_FOUND", "Work order was not found"));

    console.log("Current: " + workOrder.status + " Next: " + req.body.status)
    const result = validateStatusChange(workOrder.status, req.body.status);
    if (!result.ok){
        return next( new AppError(409, "INVALID_TRANSITION", `${workOrder.status} to ${req.body.status} is not a valid transition`, result.errors));
    }

    const updatedWorkOrder = workOrderService.updateStatus(workOrder.id, result.next);
    sendJson(res, 201, req.requestId, updatedWorkOrder);

}

export async function deleteById(req, res, next) {
    const workOrder = await workOrderService.findById(req.params.id);
    if(!workOrder) return next( new AppError(404, "NOT_FOUND", "Work order was not found"));

    workOrderService.delete(workOrder.id);
    sendJson(res, 204);
  
}




export async function bulkUpload(req, res, next) {
    if(!req.file){
    return next( new AppError(400, "VALIDATION_ERROR", "File cannot be null"));
  }
  if (req.file.buffer.length > LIMITS.MAX_CSV_BYTES){
    return next(new AppError(413,"PAYLOAD_TOO_LARGE", "File size exceeds maximum allowed file size"));
  }
  const records = await parseCsvBuffer(req.file.buffer);
  
  const resultCSV = isCSV(req.file.originalname);
  if (!resultCSV){
    return next( new AppError(415, "UNSUPPORTED_MEDIA_TYPE", "Must be a CSV file"))
  }
      const errors = []

  let i = 0;
  let created = 0;
  let skipped = 0;

  for (const row of records){
    i++
    const result = validateCreateWorkOrder(row);
    if (!result.ok) {
      result.errors.forEach((err) => {
        errors.push({
          row: i,
          field: err.field,
          reason: err.reason
        })
      });
      skipped++;
      continue
    }
    await createWorkOrder(row);
    created++;
  }
  sendJson(res, 201, req.requestId, {
    uploadId: req.requestId,
    strategy: "PARTIAL_ACCEPTANCE",
    totalRows: records.length,
    accepted: created,
    rejected: skipped,
    errors: errors
  })
    
}


