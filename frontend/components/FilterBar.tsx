import React from "react";

type Filters = {
  status?: string;
  department?: string;
  priority?: string;
  assignee?: string;
  q?: string;
  page?: number;
  limit?: number;
};

type Props = {
  title?: string;
  filters: Filters;
  onChange: (next: Filters) => void;
  onApply?: () => void; // optional: if you want an Apply button
  onReset?: () => void; // optional
  showStatus?: boolean;
  showSearch?: boolean;
  showLimit?: boolean;
};

export default function FilterBar({
  title = "Filters",
  filters,
  onChange,
  onApply,
  onReset,
  showStatus = true,
  showSearch = true,
  showLimit = true,
}: Props) {
  return (
    <div className="panel" style={{ marginBottom: 12 }}>
      <div className="panel-title">{title}</div>
      <div className="panel-body">
        <div className="grid3">
          {showStatus && (
            <label className="field">
              <div className="field-label">Status</div>
              <select
                value={filters.status || ""}
                onChange={(e) => onChange({ ...filters, status: e.target.value, page: 1 })}
              >
                <option value="">All</option>
                <option value="NEW">NEW</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="BLOCKED">BLOCKED</option>
                <option value="DONE">DONE</option>
              </select>
            </label>
          )}

          <label className="field">
            <div className="field-label">Department</div>
            <select
              value={filters.department || ""}
              onChange={(e) => onChange({ ...filters, department: e.target.value, page: 1 })}
            >
              <option value="">All</option>
              <option value="FACILITIES">FACILITIES</option>
              <option value="IT">IT</option>
              <option value="SECURITY">SECURITY</option>
              <option value="HR">HR</option>
            </select>
          </label>

          <label className="field">
            <div className="field-label">Priority</div>
            <select
              value={filters.priority || ""}
              onChange={(e) => onChange({ ...filters, priority: e.target.value, page: 1 })}
            >
              <option value="">All</option>
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
            </select>
          </label>

          <label className="field">
            <div className="field-label">Assignee</div>
            <input
              value={filters.assignee || ""}
              onChange={(e) => onChange({ ...filters, assignee: e.target.value, page: 1 })}
              placeholder="e.g. Alex"
            />
          </label>

          {showSearch && (
            <label className="field" style={{ gridColumn: "1 / -1" }}>
              <div className="field-label">Search (title)</div>
              <input
                value={filters.q || ""}
                onChange={(e) => onChange({ ...filters, q: e.target.value, page: 1 })}
                placeholder="keyword..."
              />
            </label>
          )}

          {showLimit && (
            <label className="field">
              <div className="field-label">Per page</div>
              <select
                value={String(filters.limit || 10)}
                onChange={(e) => onChange({ ...filters, limit: Number(e.target.value), page: 1 })}
              >
                {[5, 10, 20, 50].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
          )}

          {(onApply || onReset) && (
            <div style={{ display: "flex", alignItems: "end", gap: 8 }}>
              {onApply && (
                <button className="btn" onClick={onApply}>
                  Apply
                </button>
              )}
              {onReset && (
                <button className="btn btn-secondary" onClick={onReset}>
                  Reset
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}