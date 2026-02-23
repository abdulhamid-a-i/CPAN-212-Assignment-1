import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import ErrorBanner from "../../components/ErrorBanner";
import { getWorkOrder, changeWorkOrderStatus } from "../../services/api";

export default function WorkOrderDetailsPage() {
  const router = useRouter();
  const { id } = router.query;

  const [workOrder, setWorkOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const allowedNext = useMemo(() => {
    if (!workOrder) return [];
    const cur = workOrder.status;

    if (cur === "NEW") return ["NEW", "IN_PROGRESS"];
    if (cur === "IN_PROGRESS") return ["IN_PROGRESS", "BLOCKED", "DONE"];
    if (cur === "BLOCKED") return ["BLOCKED", "IN_PROGRESS"];
    if (cur === "DONE") return ["DONE"]; 
    return [cur];
  }, [workOrder]);

  async function load() {
    if (!id) return;
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const data = await getWorkOrder(id);
      setWorkOrder(data.data);
      setStatus(data.status);
    } catch (e) {
      setError(e.message || "Failed to load work order");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();

  }, [id]);

  async function save() {
    if (!workOrder) return;
    try {
      setSaving(true);
      setError("");
      setMessage("");

      const updated = await changeWorkOrderStatus(workOrder.id, status);
      setWorkOrder(updated);
      setMessage("Status updated!");
      load();
    } catch (e) {

      const details = Array.isArray(e.details) ? e.details.map((d) => JSON.stringify(d)).join(" | ") : "";
      setError(details ? `${e.message}: ${details}` : e.message || "Update failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Layout title="Work Order Details">
      <div style={{ padding: 20 }}>
        <Link href="/workorders">← Back to list</Link>
        <h1>Work Order Details</h1>

        <ErrorBanner message={error} />
        {message && <p style={{ color: "green" }}>{message}</p>}
        {loading && <p>Loading...</p>}

        {!loading && workOrder && (
          <div>
            <p><b>ID:</b> {workOrder.id}</p>
            <p><b>Title:</b> {workOrder.title}</p>
            <p><b>Description:</b> {workOrder.description || "-"}</p>
            <p><b>Department:</b> {workOrder.department}</p>
            <p><b>Priority:</b> {workOrder.priority}</p>
            <p><b>Status:</b> {workOrder.status}</p>
            <p><b>Assignee:</b> {workOrder.assignee || "-"}</p>

            <div style={{ marginTop: 14 }}>
              <label>
                Change status:&nbsp;
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                  {allowedNext.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </label>

              <button
                style={{ marginLeft: 12 }}
                disabled={saving || status === workOrder.status}
                onClick={save}
              >
                {saving ? "Saving..." : "Update Status"}
              </button>
            </div>

            {workOrder.status === "DONE" && (
              <p style={{ marginTop: 10, color: "#666" }}>
                DONE work orders cannot be moved to another status.
              </p>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}