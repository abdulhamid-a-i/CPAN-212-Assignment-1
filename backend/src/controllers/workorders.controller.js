import { workOrderService } from "../services/workorders.service";
import { sendJson } from "../middleware/response.middleware";
import { AppError } from "../utils/apperror";

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
    
}


