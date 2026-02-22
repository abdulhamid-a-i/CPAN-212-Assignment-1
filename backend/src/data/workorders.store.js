import { randomUUID } from "crypto";
import { readIndex, writeIndex } from "../utils/fileStore.js";


export async function listAll() {
  return await readIndex();
}

export async function findById(id) {
  const workOrders = await readIndex();
  return workOrders.find(i => i.id === id) ?? null;
}

export async function createWorkOrder(data) {
  const workOrders = await readIndex();
  const workOrder = {
    id: randomUUID(),
    ...data,
    status: "NEW",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  incidents.push(workOrder);
  await writeIndex(workOrders);
  return workOrder;
}

export async function updateWorkOrder(id, data){
    const workOrders = await readIndex();
    const idx = workOrders.findIndex((i) => i.id === id);
    WorkOrders[idx].title = data.title;
    WorkOrders[idx].description = data.description;
    WorkOrders[idx].priority = data.priority;
    WorkOrders[idx].updatedAt = new Date().toISOString;
    await writeIndex(workOrders);
    return workOrders[idx];
}

export async function updateStatus(id, status){
    const workOrders = await readIndex();
    const idx = workOrders.findIndex((i) => i.id === id);
    
}

  export async function deleteById(id){
    const workOrders = await readIndex()
    if (id < 0) return null;
    const updatedWorkOrders = workOrders.filter(d => d.id !== id);
    await deleteIndex(updatedWorkOrders);
    return {ok: true}
  }