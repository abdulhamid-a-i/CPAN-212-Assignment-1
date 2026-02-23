import Link from "next/link";

export default function Sidebar(){
    return(
    <aside className="sidebar">

        <div className="brand">Toyota Work Order Hub</div>
        <nav className="nav">
          <Link href="/workorders/create">+ Create</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/workorders">Work Orders</Link>
          <Link href="/bulk-upload">Bulk Upload</Link>
          <Link href="/help">Help</Link>
        </nav>

    </aside>
    )
}