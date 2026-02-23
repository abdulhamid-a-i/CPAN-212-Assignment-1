import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import ErrorBanner from "../../components/ErrorBanner";
import WorkOrderForm from "../../components/WorkOrderForm";
import { getWorkOrder, changeWorkOrderStatus, updateWorkOrder, deleteWorkOrder } from "../../services/api";

export default function WorkOrderDetailsPage() {
  const router = useRouter();
  const { id } = router.query;

  const [workOrder, setWorkOrder] = useState<any>(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  
  const allowedNext = useMemo(() => {
    if (!workOrder) return [];
    const cur = workOrder.status;

    if (cur === "NEW") return ["IN_PROGRESS"];
    if (cur === "IN_PROGRESS") return ["BLOCKED", "DONE"];
    if (cur === "BLOCKED") return ["IN_PROGRESS"];
    if (cur === "DONE") return [];
    return [];
  }, [workOrder]);

  async function load() {
    if (!id) return;
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const res = await getWorkOrder(id as string);
      const wo = res?.data; 
      setWorkOrder(wo);

      
      setStatus(wo?.status || "");
    } catch (e: any) {
      setError(e?.message || "Failed to load work order");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  async function save() {
    if (!workOrder) return;
    if (!status) return;

    try {
      setSaving(true);
      setError("");
      setMessage("");

      await changeWorkOrderStatus(workOrder.id, status);

      setMessage("Status updated!");
      await load(); 
    } catch (e: any) {
      const details = Array.isArray(e?.details)
        ? e.details.map((d: any) => JSON.stringify(d)).join(" | ")
        : "";

      setError(details ? `${e.message}: ${details}` : e?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleEdit(values: any) {
    if (!workOrder) return;

    try {
      setError("");
      setMessage("");

      await updateWorkOrder(workOrder.id, {
        title: values.title,
        description: values.description,
        priority: values.priority,
        assignee: values.assignee ? values.assignee : null,
      });

      setMessage("Work order updated!");
      await load();
    } catch (e: any) {
      const details = Array.isArray(e?.details)
        ? e.details.map((d: any) => JSON.stringify(d)).join(" | ")
        : "";

      setError(details ? `${e.message}: ${details}` : e?.message || "Update failed");
      throw e; 
    }
  }

  async function handleDelete() {
    if (!workOrder) return;

    const ok = confirm("Delete this work order? This cannot be undone.");
    if (!ok) return;

    try {
      setError("");
      setMessage("");

      await deleteWorkOrder(workOrder.id);
      router.push("/workorders");
    } catch (e: any) {
      const details = Array.isArray(e?.details)
        ? e.details.map((d: any) => JSON.stringify(d)).join(" | ")
        : "";
      setError(details ? `${e.message}: ${details}` : e?.message || "Delete failed");
    }
  }

  const statusChangeDisabled =
    saving ||
    !workOrder ||
    !status ||
    status === workOrder.status ||
    workOrder.status === "DONE";

  return (
    <Layout title="Work Order Details">
      <div style={{ padding: 20 }}>
        <Link href="/workorders">← Back to list</Link>
        <h1>Work Order Details</h1>

        <ErrorBanner
          error={
            error
              ? {
                  message: error,
                  code: 500,
                  details: [],
                }
              : null
          }
        />
        {message && <p style={{ color: "green" }}>{message}</p>}
        {loading && <p>Loading...</p>}

        {!loading && workOrder && (
          <div>
            <p>
              <b>ID:</b> {workOrder.id}
            </p>
            <p>
              <b>Title:</b> {workOrder.title}
            </p>
            <p>
              <b>Description:</b> {workOrder.description || "-"}
            </p>
            <p>
              <b>Department:</b> {workOrder.department}
            </p>
            <p>
              <b>Priority:</b> {workOrder.priority}
            </p>
            <p>
              <b>Status:</b> {workOrder.status}
            </p>
            <p>
              <b>Assignee:</b> {workOrder.assignee || "-"}
            </p>

            <div style={{ marginTop: 20 }}>
              <h2>Edit Work Order</h2>
              <WorkOrderForm
                mode="edit"
                initialValues={{
                  title: workOrder.title,
                  description: workOrder.description,
                  priority: workOrder.priority,
                  assignee: workOrder.assignee || "",
                }}
                onSubmit={handleEdit}
                submitLabel="Save Changes"
              />
            </div>

            <div style={{ marginTop: 14 }}>
              {workOrder.status === "DONE" ? (
                <p style={{ marginTop: 10, color: "#666" }}>
                  DONE work orders cannot be moved to another status.
                </p>
              ) : (
                <>
                  <label>
                    Change status:&nbsp;
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="">Select next status</option>
                      {allowedNext.map((s: string) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </label>

                  <button
                    style={{ marginLeft: 12 }}
                    disabled={statusChangeDisabled}
                    onClick={save}
                  >
                    {saving ? "Saving..." : "Update Status"}
                  </button>
                </>
              )}
            </div>
            <div style={{ marginTop: 20 }}>
              <button className="btn btn-secondary" onClick={handleDelete}>
                Delete Work Order
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}