import { workOrderService } from "../services/workorders.service.js";
import { sendJson } from "../middleware/response.middleware.js";
import { AppError } from "../utils/apperror.js";
import { validateCreateWorkOrder } from "../utils/validators.js";

export async function list(req,res){
    
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
    const workOrder = workOrderService.create(result.value);
    sendJson(res, 201, req.requestId, workOrder);

}


export async function bulkUpload(req, res, next, records) {
      const errors = []
  

  let created = 0;
  let skipped = 0;

  for (const row of records){
    const result = validateCreateWorkOrder(row);
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
    
}


