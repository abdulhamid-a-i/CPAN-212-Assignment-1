import { createWorkOrder, deleteById, findById, listAll, updateStatus, updateWorkOrder } from "../data/workorders.store.js"

export const workOrderService = {
    async list(filters){
        const workOrders = await listAll();
        const {q, status, department, priority, assignee, page, limit} = filters ?? {};
        
        const filteredWorkOrders = workOrders.filter((w) => {
            const okStatus = status ? w.status === status : true;
            const okDepartment = department ? w.department === department : true;
            const okPriority = priority ? w.priority === priority : true;
            const okTitle = q ? w.title?.toLowerCase().includes(q.toLowerCase()) : true;
            const okAssignee = assignee ? w.assignee?.toLowerCase().includes(assignee.toLowerCase()) : true;
            return okStatus && okDepartment && okPriority && okAssignee && okTitle;
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

    async findById(id){
        return await findById(id);
    },

    async create({title, description, department, priority, requesterName, assignee}){
        console.log("Requester Name: " + requesterName)
        const workOrder  = {
            title,
            description,
            department,
            priority,
            requesterName,
            assignee: assignee ?? null
        }

        return await createWorkOrder(workOrder);

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

    async updateStatus(id, status){
        return updateStatus(id, status);
    },

    async delete(id){
        return deleteById(id);


    }

}