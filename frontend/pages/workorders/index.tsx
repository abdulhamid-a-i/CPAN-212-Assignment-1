import { useEffect, useState } from "react";
import Link from "next/link";
import Layout from "../../components/Layout";
import ErrorBanner from "../../components/ErrorBanner";
import { listWorkOrders } from "../../services/api";
import WorkOrdersTable from "../../components/WorkOrdersTable";
import FilterBar from "../../components/FilterBar";

export default function WorkOrdersPage() {
  const [workOrders, setWorkOrders] = useState<any[]>([]);
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

  const handleReset = (data: any) => {
    // When resetting filters, also go back to page 1
    setFilters({ ...data, page: 1 });
  };

  const onHandleChange = (data: any) => {
    // When changing filters, reset to page 1 so pagination doesn't land on empty pages
    setFilters({ ...data, page: 1 });
  };

  const handleLoad = () => {
    load();
  };

  async function load() {
    try {
      setLoading(true);
      setError("");

      const assignee = (filters.assignee || "").trim();

      const res = await listWorkOrders({
        status: filters.status || undefined,
        department: filters.department || undefined,
        priority: filters.priority || undefined,
        assignee: assignee ? assignee : undefined,
        page: filters.page,
        limit: filters.limit,
      });

      setWorkOrders(Array.isArray(res?.data?.items) ? res.data.items : []);
      setTotal(typeof res?.data?.total === "number" ? res.data.total : 0);
    } catch (e: any) {
      setError(e?.message || "Failed to load work orders");
      setWorkOrders([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [
    filters.status,
    filters.department,
    filters.priority,
    filters.assignee,
    filters.page,
    filters.limit,
  ]);

  const totalPages = Math.max(1, Math.ceil(total / (filters.limit || 10)));

  return (
    <Layout title="Work Orders">
      <div style={{ padding: 20 }}>
        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          {/* Keep only what you own */}
          <Link className="linkbutton" href="/workorders/create">
            Create Work Order
          </Link>
        </div>

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

        <FilterBar
          filters={filters}
          title="Work Orders"
          onApply={handleLoad}
          onChange={onHandleChange}
          onReset={handleReset}
        />

        {loading && <p>Loading...</p>}

        {!loading && !error && (
          <>
            <WorkOrdersTable items={workOrders} loading={loading} />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 12,
              }}
            >
              <div style={{ color: "#666" }}>
                Page <b>{filters.page}</b> of <b>{totalPages}</b> · Total:{" "}
                <b>{total}</b>
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