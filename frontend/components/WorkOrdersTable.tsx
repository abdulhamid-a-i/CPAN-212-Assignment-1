import React from "react";
import Link from "next/link";
import { WorkOrder } from "../types/workorder";



type Props = {
  items: WorkOrder[];
  loading?: boolean;
};

export default function WorkOrdersTable({ items, loading }: Props) {
  if (loading) return <p>Loading...</p>;
  

  return (
    <table border={1} cellPadding={8} cellSpacing={0} width="100%">
      <thead>
        <tr>
          <th>Title</th>
          <th>Department</th>
          <th>Priority</th>
          <th>Status</th>
          <th>Requester</th>
          <th>Assignee</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {items.map((w) => (
          <tr key={w.id}>
            <td>
              <Link href={`/workorders/${w.id}`}>{w.title}</Link>
            </td>
            <td>{w.department}</td>
            <td>{w.priority}</td>
            <td>{w.status}</td>
            <td>{w.requesterName}</td>
            <td>{w.assignee || "-"}</td>
          </tr>
        ))}
        {items.length === 0 && (
          <tr>
            <td colSpan={5}>No work orders found.</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}