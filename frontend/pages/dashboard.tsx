import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import ErrorBanner from "../components/ErrorBanner";
import { listWorkOrders } from "../services/api";
import FilterBar from "../components/FilterBar";

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

  const handleReset = (data) => {
    setFilters(data);
  }

    const onHandleChange = (data) => {
    setFilters(data);
  }

    const handleLoad = () => {
    load();
  }

  async function load() {
    try {
      setLoading(true);
      setErr("");

      const data = await listWorkOrders({
        department: filters.department || undefined,
        priority: filters.priority || undefined,
        status: filters.status || undefined,
        assignee: filters.assignee.trim() ? filters.assignee.trim() : undefined,
        q: filters.q.trim() ? filters.q.trim() : undefined,
        page: 1,
        limit: 200,
      });

      const payload = data.data;

      // Supports both formats:
      // 1) Array
      // 2) { items, page, limit, total }

      setItems(Array.isArray(payload.items) ? payload.items : []);
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
      <FilterBar filters={filters} title="Dashboard"onApply={handleLoad} onChange={onHandleChange} onReset={handleReset}/>

      {/* KPIs */}
      <div className="kpis">
        <div className="kpi"><div className="kpi-label">Total</div><div className="kpi-value">{stats.total}</div></div>
        <div className="kpi"><div className="kpi-label">NEW</div><div className="kpi-value">{stats.NEW}</div></div>
        <div className="kpi"><div className="kpi-label">IN_PROGRESS</div><div className="kpi-value">{stats.IN_PROGRESS}</div></div>
        <div className="kpi"><div className="kpi-label">BLOCKED</div><div className="kpi-value">{stats.BLOCKED}</div></div>
        <div className="kpi"><div className="kpi-label">DONE</div><div className="kpi-value">{stats.DONE}</div></div>
        <div className="kpi"><div className="kpi-label">High Priority</div><div className="kpi-value">{stats.high}</div></div>
      </div>

     
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