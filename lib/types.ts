export type RequestStatus =
  | "new"
  | "under_review"
  | "accepted"
  | "deferred"
  | "rejected";

export type Urgency = "low" | "medium" | "high" | "critical";

export type ImpactArea =
  | "product"
  | "engineering"
  | "operations"
  | "design"
  | "other";

export type ReviewAction = "accept" | "defer" | "reject" | "clarify";

export interface IntakeRequest {
  id: string;
  title: string;
  businessContext: string;
  impactArea: ImpactArea;
  urgency: Urgency;
  requesterName: string;
  status: RequestStatus;
  reviewNote?: string;
  createdAt: string;
  updatedAt: string;
}

// ---- Projects & Boards ----

export type BoardColumn = "backlog" | "in_progress" | "in_review" | "done";

export const BOARD_COLUMNS: { key: BoardColumn; label: string }[] = [
  { key: "backlog", label: "Backlog" },
  { key: "in_progress", label: "In Progress" },
  { key: "in_review", label: "In Review" },
  { key: "done", label: "Done" },
];

export interface Requirement {
  id: string;
  text: string;
  completed: boolean;
}

export interface Ticket {
  id: string;
  projectId: string;
  /** The original intake request this ticket came from */
  intakeRequestId: string;
  title: string;
  businessContext: string;
  impactArea: ImpactArea;
  urgency: Urgency;
  column: BoardColumn;
  assignee?: string;
  requirements: Requirement[];
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  archived: boolean;
  createdAt: string;
}
