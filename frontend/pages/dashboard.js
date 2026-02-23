import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import ErrorBanner from "../components/ErrorBanner";
import { listWorkOrders } from "../services/api";

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  // Visual management filters 
  const [filters, setFilters] = useState({
    department: "",
    priority: "",
    assignee: "",
    q: "",
  });

  async function load() {
    try {
      setLoading(true);
      setErr("");

      const data = await listWorkOrders({
        department: filters.department || undefined,
        priority: filters.priority || undefined,
        assignee: filters.assignee.trim() ? filters.assignee.trim() : undefined,
        q: filters.q.trim() ? filters.q.trim() : undefined,
        page: 1,
        limit: 200,
      });

      // Supports both formats:
      // 1) Array
      // 2) { items, page, limit, total }
      const list = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
      setItems(list);
    } catch (e) {
      setErr(e.message || "Failed to load work orders");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [filters.department, filters.priority, filters.assignee, filters.q]);

  const stats = useMemo(() => {
    const total = items.length;
    const NEW = items.filter((x) => x.status === "NEW").length;
    const IN_PROGRESS = items.filter((x) => x.status === "IN_PROGRESS").length;
    const BLOCKED = items.filter((x) => x.status === "BLOCKED").length;
    const DONE = items.filter((x) => x.status === "DONE").length;
    const high = items.filter((x) => x.priority === "HIGH").length;
    return { total, NEW, IN_PROGRESS, BLOCKED, DONE, high };
  }, [items]);

  return (
    <Layout title="Dashboard">
      <ErrorBanner message={err} />

      {/* Filters */}
      <div className="panel" style={{ marginBottom: 12 }}>
        <div className="panel-title">Filters</div>
        <div className="panel-body">
          <div className="grid3">
            <label className="field">
              <div className="field-label">Department</div>
              <select
                value={filters.department}
                onChange={(e) => setFilters((f) => ({ ...f, department: e.target.value }))}
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
                value={filters.priority}
                onChange={(e) => setFilters((f) => ({ ...f, priority: e.target.value }))}
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
                value={filters.assignee}
                onChange={(e) => setFilters((f) => ({ ...f, assignee: e.target.value }))}
                placeholder="e.g. Alex"
              />
            </label>

            <label className="field" style={{ gridColumn: "1 / -1" }}>
              <div className="field-label">Search (title)</div>
              <input
                value={filters.q}
                onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
                placeholder="keyword..."
              />
            </label>
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <button className="btn" onClick={load} disabled={loading}>
              {loading ? "Loading..." : "Refresh"}
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setFilters({ department: "", priority: "", assignee: "", q: "" })}
              disabled={loading}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="kpis">
        <div className="kpi"><div className="kpi-label">Total</div><div className="kpi-value">{stats.total}</div></div>
        <div className="kpi"><div className="kpi-label">NEW</div><div className="kpi-value">{stats.NEW}</div></div>
        <div className="kpi"><div className="kpi-label">IN_PROGRESS</div><div className="kpi-value">{stats.IN_PROGRESS}</div></div>
        <div className="kpi"><div className="kpi-label">BLOCKED</div><div className="kpi-value">{stats.BLOCKED}</div></div>
        <div className="kpi"><div className="kpi-label">DONE</div><div className="kpi-value">{stats.DONE}</div></div>
        <div className="kpi"><div className="kpi-label">High Priority</div><div className="kpi-value">{stats.high}</div></div>
      </div>

      {/* 4 columns required */}
      <div className="grid4">
        <StatusColumn title="NEW" items={items.filter((x) => x.status === "NEW")} />
        <StatusColumn title="IN_PROGRESS" items={items.filter((x) => x.status === "IN_PROGRESS")} />
        <StatusColumn title="BLOCKED" items={items.filter((x) => x.status === "BLOCKED")} />
        <StatusColumn title="DONE" items={items.filter((x) => x.status === "DONE")} />
      </div>
    </Layout>
  );
}

function StatusColumn({ title, items }) {
  return (
    <div className="panel">
      <div className="panel-title">
        {title} ({items.length})
      </div>

      <div className="panel-body">
        {items.length === 0 ? (
          <div className="muted">No work orders</div>
        ) : (
          items.map((x) => (
            <div key={x.id} className="card">
              <div className="card-title">{x.title}</div>

              <div className="card-meta">
                <span className="tag">{x.department}</span>

                <span className={`tag ${x.priority === "HIGH" ? "tag-danger" : x.priority === "MEDIUM" ? "tag-warn" : ""}`}>
                  {x.priority}
                </span>

                <span className="tag">{x.assignee ? `@${x.assignee}` : "Unassigned"}</span>
              </div>

              <a className="link" href={`/workorders/${x.id}`}>Open</a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}