export type WorkOrder = {
  id: string;
  title: string;
  department: string;
  priority: string;
  status: string;
  requesterName: string
  assignee?: string | null;
};