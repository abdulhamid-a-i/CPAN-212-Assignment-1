import { useEffect, useState } from "react";
import Link from "next/link";
import Layout from "../../components/Layout";
import ErrorBanner from "../../components/ErrorBanner";
import { deleteWorkOrder, listWorkOrders } from "../../services/api";
import WorkOrdersTable from "../../components/WorkOrdersTable";
import FilterBar from "../../components/FilterBar";

export default function WorkOrdersPage() {
  const [workOrders, setWorkOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

    const handleDelete = async(data) => {
          if (!data) return;
          const ok = confirm("Delete this work order? This cannot be undone.");
          if (!ok) return;
          
            try {const res = await deleteWorkOrder(data);
            load();
            } catch(err){
              setError(err.message);
            }
    }

     const handleReset = () => {
       const data= {status:"",
      department:"",
      priority:"",
      assignee:"",
      q:"",
      page:1,
      limit:10
    
  }
    setFilters(data);
     load()
    
  }
 const onHandleChange = (data) => {
      console.log("change: ", data)
    setFilters(data);
    load();
  }


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

      setWorkOrders(Array.isArray(data.data.items) ? data.data.items : []);
      setTotal(data.data.total)
    } catch (e) {
      setError(e.message);
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

        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
          <Link className="linkbutton" href="/workorders/create">Create Work Order</Link>
          <Link className="linkbutton" href="/bulk-upload">Bulk Upload</Link>
          <Link className="linkbutton" href="/dashboard">Dashboard</Link>
        </div>

        <ErrorBanner message={error} />

        {/* Filters */}
        
        <FilterBar filters={filters} title="Work Orders" onChange={onHandleChange} onReset={handleReset}/>

        {loading && <p>Loading...</p>}

        {!loading && !error && (
          <>
          <WorkOrdersTable items={workOrders} loading={loading} onLoad={handleDelete}/>
          
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