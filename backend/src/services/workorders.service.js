import { createWorkOrder, findById, listAll, updateWorkOrder } from "../data/workorders.store.js"
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
        console.log(assignee)
        const workOrder  = {
            title,
            description,
            department,
            priority,
            requesterName,
            assignee: assignee ?? null
        }

        return createWorkOrder(workOrder);

    },

    async update(id, {title,description,priority,assignee}){

        const data = {
            title,
            description,
            priority,
            assignee: assignee
        }

        return updateWorkOrder(id, data);

    },
    async delete(id){


    }

}