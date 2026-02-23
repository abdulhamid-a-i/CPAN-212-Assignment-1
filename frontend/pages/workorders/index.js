import { useEffect, useState } from "react";
import Link from "next/link";
import Layout from "../../components/Layout";
import ErrorBanner from "../../components/ErrorBanner";
import { listWorkOrders } from "../../services/api";

export default function WorkOrdersPage() {
  const [workOrders, setWorkOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);


  const [filters, setFilters] = useState({
    status: "",
    department: "",
    priority: "",
    assignee: "",
    page: 1,
    limit: 10,
  });

  const [total, setTotal] = useState(0);

  async function load() {
    try {
      setLoading(true);
      setError("");

      const data = await listWorkOrders({
        status: filters.status || undefined,
        department: filters.department || undefined,
        priority: filters.priority || undefined,
        assignee: filters.assignee.trim() ? filters.assignee.trim() : undefined,
        page: filters.page,
        limit: filters.limit,
      });

      // Support both formats:
      // 1) Array
      // 2) { items, page, limit, total }
      const list = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
      setWorkOrders(list);

      const t = typeof data?.total === "number" ? data.total : list.length;
      setTotal(t);
    } catch (e) {
      setError(e.message || "Failed to load work orders");
      setWorkOrders([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [filters.status, filters.department, filters.priority, filters.assignee, filters.page, filters.limit]);

  const totalPages = Math.max(1, Math.ceil(total / (filters.limit || 10)));

  return (
    <Layout title="Work Orders">
      <div style={{ padding: 20 }}>
        <h1>Work Orders</h1>

        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
          <Link href="/workorders/create">Create Work Order</Link>
          <Link href="/bulk-upload">Bulk Upload</Link>
          <Link href="/dashboard">Dashboard</Link>
        </div>

        <ErrorBanner message={error} />

        {/* Filters */}
        <div className="panel" style={{ marginBottom: 12 }}>
          <div className="panel-title">Filters</div>
          <div className="panel-body" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            <label className="field">
              <div className="field-label">Status</div>
              <select value={filters.status} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value, page: 1 }))}>
                <option value="">All</option>
                <option value="NEW">NEW</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="BLOCKED">BLOCKED</option>
                <option value="DONE">DONE</option>
              </select>
            </label>

            <label className="field">
              <div className="field-label">Department</div>
              <select value={filters.department} onChange={(e) => setFilters((f) => ({ ...f, department: e.target.value, page: 1 }))}>
                <option value="">All</option>
                <option value="FACILITIES">FACILITIES</option>
                <option value="IT">IT</option>
                <option value="SECURITY">SECURITY</option>
                <option value="HR">HR</option>
              </select>
            </label>

            <label className="field">
              <div className="field-label">Priority</div>
              <select value={filters.priority} onChange={(e) => setFilters((f) => ({ ...f, priority: e.target.value, page: 1 }))}>
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
                onChange={(e) => setFilters((f) => ({ ...f, assignee: e.target.value, page: 1 }))}
                placeholder="e.g. Alex"
              />
            </label>

            <label className="field">
              <div className="field-label">Per page</div>
              <select value={String(filters.limit)} onChange={(e) => setFilters((f) => ({ ...f, limit: Number(e.target.value), page: 1 }))}>
                {[5, 10, 20, 50].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </label>

            <div style={{ display: "flex", alignItems: "end", gap: 8 }}>
              <button className="btn" onClick={load} disabled={loading}>
                {loading ? "Loading..." : "Apply"}
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setFilters({ status: "", department: "", priority: "", assignee: "", page: 1, limit: 10 })}
                disabled={loading}
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {loading && <p>Loading...</p>}

        {!loading && !error && (
          <>
            <table border="1" cellPadding="8" cellSpacing="0" width="100%">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Department</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Assignee</th>
                </tr>
              </thead>
              <tbody>
                {workOrders.map((w) => (
                  <tr key={w.id}>
                    <td>
                      <Link href={`/workorders/${w.id}`}>{w.title}</Link>
                    </td>
                    <td>{w.department}</td>
                    <td>{w.priority}</td>
                    <td>{w.status}</td>
                    <td>{w.assignee || "-"}</td>
                  </tr>
                ))}
                {workOrders.length === 0 && (
                  <tr>
                    <td colSpan="5">No work orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
              <div style={{ color: "#666" }}>
                Page <b>{filters.page}</b> of <b>{totalPages}</b> · Total: <b>{total}</b>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button
                  className="btn"
                  disabled={filters.page <= 1}
                  onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
                >
                  Prev
                </button>
                <button
                  className="btn"
                  disabled={filters.page >= totalPages}
                  onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}