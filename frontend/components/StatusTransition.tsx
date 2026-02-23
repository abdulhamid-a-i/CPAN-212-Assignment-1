import React, { useMemo, useState } from "react";
import InlineError from "./InlineError";
import { TRANSITIONS } from "../config";

type WorkOrder = {
  id: string;
  status: "NEW" | "IN_PROGRESS" | "BLOCKED" | "DONE";
};

type Props = {
  workOrder: WorkOrder;
  onUpdateStatus: (nextStatus: WorkOrder["status"]) => Promise<void>;
};

export default function StatusTransition({ workOrder, onUpdateStatus }: Props) {
  const [status, setStatus] = useState(workOrder.status);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

   const allowedNext = TRANSITIONS[workOrder.status] || [];

  async function save() {
    try {
      setSaving(true);
      setError("");
      setMessage("");
      await onUpdateStatus(status);
      setMessage("Status updated!");
    } catch (e: any) {
      const details = Array.isArray(e?.details) ? e.details.map((d: any) => JSON.stringify(d)).join(" | ") : "";
      setError(details ? `${e?.message || "Update failed"}: ${details}` : e?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ marginTop: 14 }}>
      {error ? (
        // If InlineError exists use it, otherwise fallback:
        <InlineError message={error} />
      ) : null}

      {message && <p style={{ color: "green" }}>{message}</p>}

      <label>
        Change status:&nbsp;
        <select value={status} onChange={(e) => setStatus(e.target.value as any)}>
          {allowedNext.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>

      <button style={{ marginLeft: 12 }} disabled={saving || status === workOrder.status} onClick={save}>
        {saving ? "Saving..." : "Update Status"}
      </button>

      {workOrder.status === "DONE" && (
        <p style={{ marginTop: 10, color: "#666" }}>
          DONE work orders cannot be moved to another status.
        </p>
      )}
    </div>
  );
}