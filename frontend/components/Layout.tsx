import Link from "next/link";
import Sidebar from "./Sidebar";

export default function Layout({ title, children }) {
  return (
    <div className="layout">
      <Sidebar/>

      <main className="main">
        <div className="container">
          <h1 className="pageTitle">{title}</h1>
          {children}
        </div>
      </main>
    </div>
  );
}
