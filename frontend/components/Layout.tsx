import Link from "next/link";

export default function Layout({ title, children }) {
  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">Toyota Work Order Hub</div>

        <nav className="nav">
          <Link href="/incidents/create">+ Create</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/workorders">Work Orders</Link>
          <Link href="/bulk-upload">Bulk Upload</Link>
          <Link href="/help">Help</Link>
        </nav>
      </aside>

      <main className="main">
        <div className="container">
          <h1 className="pageTitle">{title}</h1>
          {children}
        </div>
      </main>
    </div>
  );
}
