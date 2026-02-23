import { useRouter } from "next/router";
import { useState } from "react";
import Layout from "../../components/Layout";
import ErrorBanner from "../../components/ErrorBanner";
import WorkOrderForm from "../../components/WorkOrderForm";
import { createWorkOrder } from "../../services/api";

export default function CreateWorkOrderPage() {
  const router = useRouter();
  const [error, setError] = useState<any>(null);

  async function handleCreate(values: any) {
    try {
      setError(null);

      const res = await createWorkOrder({
        title: values.title,
        description: values.description,
        department: values.department,
        priority: values.priority,
        requesterName: values.requesterName,
        assignee: values.assignee ? values.assignee : null,
      });

      const created = res?.data;
      const id = created.id;

      if (!id) {
        throw new Error("Created work order did not return an id.");
      }

      router.push(`/workorders/${id}`);
    } catch (e: any) {
      setError({
        message: e?.message || "Failed to create work order",
        code: e?.status || 500,
        details: e?.details || [],
        requestId: e?.requestId,
      });
      throw e; // let WorkOrderForm show inline formError too
    }
  }

  return (
    <Layout title="Create Work Order">
      <ErrorBanner error={error} />
      <WorkOrderForm mode="create" onSubmit={handleCreate} />
    </Layout>
  );
}