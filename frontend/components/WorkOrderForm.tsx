import React, { useMemo, useState } from "react";
import InlineError from "./InlineError";
import { ENUMS } from "../config";

type WorkOrderFormValues = {
  title: string;
  description: string;
  department: string;
  priority: string;
  requesterName: string;
  assignee: string;
};

type WorkOrderFormErrors = Partial<Record<keyof WorkOrderFormValues, string>>;

type Props = {
  mode?: "create" | "edit";
  initialValues?: Partial<WorkOrderFormValues>;
  onSubmit: (values: WorkOrderFormValues) => Promise<void>;
  submitLabel?: string;
  disabled?: boolean;
};

export default function WorkOrderForm({
  mode = "create",
  initialValues,
  onSubmit,
  submitLabel,
  disabled,
}: Props) {
  const [values, setValues] = useState<WorkOrderFormValues>({
  title: initialValues?.title ?? "",
  description: initialValues?.description ?? "",
  department: initialValues?.department ?? "",
  priority: initialValues?.priority ?? "",
  requesterName: initialValues?.requesterName ?? "",  
  assignee: initialValues?.assignee ?? "",
});

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const errors: WorkOrderFormErrors = useMemo(() => {
    const e: WorkOrderFormErrors = {};

    if (!values.title || values.title.trim().length < 5) {
      e.title = "Title must be at least 5 characters.";
    }

    if (!values.description || values.description.trim().length < 10) {
      e.description = "Description must be at least 10 characters.";
    }

    if (mode === "create") {
        if (!values.requesterName || values.requesterName.trim().length < 3) {
        e.requesterName = "Requester name must be at least 3 characters.";
        }
    }
    
    if (mode === "create") {
      if (!values.department) e.department = "Please select a department.";
      else if (!ENUMS.DEPARTMENTS.includes(values.department)) {
        e.department = `Department must be one of: ${ENUMS.DEPARTMENTS.join(", ")}`;
      }
    }

    if (!values.priority) e.priority = "Please select a priority.";
    else if (!ENUMS.PRIORITY.includes(values.priority)) {
      e.priority = `Priority must be one of: ${ENUMS.PRIORITY.join(", ")}`;
    }

    if (values.assignee && values.assignee.length > 30) {
      e.assignee = "Assignee cannot be longer than 30 characters.";
    }

    return e;
  }, [values, mode]);

  const hasErrors = Object.keys(errors).length > 0;

  function setField<K extends keyof WorkOrderFormValues>(key: K, value: WorkOrderFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function markTouched(key: keyof WorkOrderFormValues) {
    setTouched((t) => ({ ...t, [key]: true }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    
    setTouched({
    title: true,
    description: true,
    department: true,
    priority: true,
    requesterName: true, 
    assignee: true,
    });
    setFormError("");

    if (hasErrors) return;

    try {
      setSaving(true);

      const payload: WorkOrderFormValues = {
        ...values,
        title: values.title.trim(),
        description: values.description.trim(),
        requesterName: values.requesterName.trim(), // ✅ add
        assignee: values.assignee.trim(),
        };

      await onSubmit(payload);
    } catch (err: any) {
      setFormError(err?.message || "Failed to submit form");
    } finally {
      setSaving(false);
    }
  }

  const finalSubmitLabel =
    submitLabel ?? (mode === "create" ? "Create Work Order" : "Save Changes");

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
      {formError ? <InlineError message={formError} /> : null}

      <label className="field">
        <div className="field-label">Title</div>
        <input
          value={values.title}
          onChange={(e) => setField("title", e.target.value)}
          onBlur={() => markTouched("title")}
          placeholder="e.g. Fix broken door handle"
          disabled={disabled || saving}
        />
        {touched.title && <InlineError message={errors.title} />}
      </label>

        {mode === "create" ? (
        <label className="field">
            <div className="field-label">Requester Name</div>
            <input
            value={values.requesterName}
            onChange={(e) => setField("requesterName", e.target.value)}
            onBlur={() => markTouched("requesterName")}
            placeholder="e.g. Cheyenne"
            disabled={disabled || saving}
            />
            {touched.requesterName && <InlineError message={errors.requesterName} />}
        </label>
        ) : null}

      <label className="field">
        <div className="field-label">Description</div>
        <textarea
          value={values.description}
          onChange={(e) => setField("description", e.target.value)}
          onBlur={() => markTouched("description")}
          placeholder="Give a bit more detail..."
          rows={4}
          disabled={disabled || saving}
        />
        {touched.description && <InlineError message={errors.description} />}
      </label>

      
      {mode === "create" ? (
        <label className="field">
          <div className="field-label">Department</div>
          <select
            value={values.department}
            onChange={(e) => setField("department", e.target.value)}
            onBlur={() => markTouched("department")}
            disabled={disabled || saving}
          >
            <option value="">Select...</option>
            {ENUMS.DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          {touched.department && <InlineError message={errors.department} />}
        </label>
      ) : null}

      <label className="field">
        <div className="field-label">Priority</div>
        <select
          value={values.priority}
          onChange={(e) => setField("priority", e.target.value)}
          onBlur={() => markTouched("priority")}
          disabled={disabled || saving}
        >
          <option value="">Select...</option>
          {ENUMS.PRIORITY.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        {touched.priority && <InlineError message={errors.priority} />}
      </label>

      <label className="field">
        <div className="field-label">Assignee (optional)</div>
        <input
          value={values.assignee}
          onChange={(e) => setField("assignee", e.target.value)}
          onBlur={() => markTouched("assignee")}
          placeholder="e.g. Alex"
          disabled={disabled || saving}
        />
        {touched.assignee && <InlineError message={errors.assignee} />}
      </label>

      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <button className="btn" type="submit" disabled={disabled || saving || hasErrors}>
          {saving ? "Saving..." : finalSubmitLabel}
        </button>

        {hasErrors ? <span className="muted">Fix errors above to continue.</span> : null}
      </div>
    </form>
  );
}