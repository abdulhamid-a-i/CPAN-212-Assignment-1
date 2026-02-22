import { createWorkOrder, findById, listAll } from "../data/workorders.store"
import crypto from 'crypto';


export const workOrderService = {
    async list(filters){
        const workOrders = await listAll();
        const {status, department, priority, assignee, page, limit} = filters ?? {};
        
        const filteredWorkOrders = workOrders.filter((w) => {
            const okStatus = status ? w.status === status : true;
            const okDepartment = department ? w.department === department : true;
            const okPriority = priority ? w.priority === priority : true;
            const okAssignee = assignee ? w.assignee === assignee : true;
            return okStatus && okDepartment && okPriority && okAssignee;
        })

        const offset = (page - 1) * limit;
        const paginated = filteredWorkOrders.slice(offset, offset + limit);

        return({
            items: paginated,
            page: page,
            limit: limit,
            total: filteredWorkOrders.length
        })
    },

    async get(id){
        return await findById(id);
    },

    async create({title, description, department, priority, requesterName, assignee}){
        const id = crypto.randomUUID;


        const workOrder  = {
            id,
            title,
            description,
            department,
            priority,
            requesterName,
            assignee: assignee ?? ' '
        }

        return createWorkOrder(workOrder);

    }
}