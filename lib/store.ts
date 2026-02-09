import type {
  IntakeRequest,
  RequestStatus,
  ImpactArea,
  Urgency,
  ReviewAction,
  Project,
  Ticket,
  BoardColumn,
} from "./types";

// ---- In-memory stores ---- resets on server restart.

const requests: IntakeRequest[] = [
  {
    id: "REQ-001",
    title: "Add SSO login for enterprise clients",
    businessContext:
      "Several enterprise clients have requested SSO support before signing annual contracts. This is blocking three deals worth ~$240k ARR.",
    impactArea: "engineering",
    urgency: "high",
    requesterName: "Sarah Chen",
    status: "new",
    createdAt: "2026-02-05T09:30:00Z",
    updatedAt: "2026-02-05T09:30:00Z",
  },
  {
    id: "REQ-002",
    title: "Dashboard export to CSV",
    businessContext:
      "Operations team spends 3 hours per week manually compiling reports. A CSV export would eliminate this entirely.",
    impactArea: "product",
    urgency: "medium",
    requesterName: "Marcus Johnson",
    status: "under_review",
    createdAt: "2026-02-04T14:15:00Z",
    updatedAt: "2026-02-05T10:00:00Z",
  },
  {
    id: "REQ-003",
    title: "Redesign onboarding flow",
    businessContext:
      "Current onboarding has a 40% drop-off rate at step 3. User research shows confusion around workspace setup.",
    impactArea: "design",
    urgency: "high",
    requesterName: "Priya Patel",
    status: "accepted",
    reviewNote: "Aligned with Q1 UX initiative. Assigning to design sprint 4.",
    createdAt: "2026-02-03T11:00:00Z",
    updatedAt: "2026-02-04T16:30:00Z",
  },
  {
    id: "REQ-004",
    title: "API rate limiting for public endpoints",
    businessContext:
      "We've seen two incidents of abuse on public API endpoints this month. Need rate limiting before it impacts uptime.",
    impactArea: "engineering",
    urgency: "critical",
    requesterName: "Alex Rivera",
    status: "accepted",
    reviewNote: "Critical security concern. Fast-tracking to current sprint.",
    createdAt: "2026-02-02T08:45:00Z",
    updatedAt: "2026-02-02T11:00:00Z",
  },
  {
    id: "REQ-005",
    title: "Integrate with Salesforce CRM",
    businessContext:
      "Sales team wants lead data synced automatically. Currently copy-pasting between tools.",
    impactArea: "operations",
    urgency: "low",
    requesterName: "Jordan Lee",
    status: "deferred",
    reviewNote:
      "Valid request but not prioritized for this quarter. Revisiting in Q2 planning.",
    createdAt: "2026-02-01T13:20:00Z",
    updatedAt: "2026-02-03T09:00:00Z",
  },
  {
    id: "REQ-006",
    title: "Mobile-responsive admin panel",
    businessContext:
      "Field ops managers need to approve items on mobile. Current admin panel is desktop-only.",
    impactArea: "product",
    urgency: "medium",
    requesterName: "Taylor Kim",
    status: "rejected",
    reviewNote:
      "Native mobile app is in the roadmap for Q3. Will address this there instead.",
    createdAt: "2026-01-30T16:00:00Z",
    updatedAt: "2026-02-01T10:00:00Z",
  },
];

let reqCounter = requests.length;

function nextReqId(): string {
  reqCounter++;
  return `REQ-${String(reqCounter).padStart(3, "0")}`;
}

// ---- Projects & Tickets seed data ----

const projects: Project[] = [
  {
    id: "PRJ-001",
    name: "Q1 UX Improvements",
    description: "Accepted requests related to user experience work this quarter.",
    archived: false,
    createdAt: "2026-02-04T12:00:00Z",
  },
  {
    id: "PRJ-002",
    name: "Security Hardening",
    description: "Critical security and infrastructure work.",
    archived: false,
    createdAt: "2026-02-03T10:00:00Z",
  },
];

const tickets: Ticket[] = [
  {
    id: "TKT-001",
    projectId: "PRJ-001",
    intakeRequestId: "REQ-003",
    title: "Redesign onboarding flow",
    businessContext:
      "Current onboarding has a 40% drop-off rate at step 3. User research shows confusion around workspace setup.",
    impactArea: "design",
    urgency: "high",
    column: "in_progress",
    assignee: "Priya Patel",
    requirements: [
      { id: "r-1", text: "Reduce step-3 drop-off rate to under 20%", completed: false },
      { id: "r-2", text: "Simplify workspace setup to a single screen", completed: true },
      { id: "r-3", text: "Add contextual help tooltips at each onboarding step", completed: false },
    ],
    createdAt: "2026-02-04T17:00:00Z",
    updatedAt: "2026-02-05T09:00:00Z",
  },
  {
    id: "TKT-002",
    projectId: "PRJ-002",
    intakeRequestId: "REQ-004",
    title: "API rate limiting for public endpoints",
    businessContext:
      "We've seen two incidents of abuse on public API endpoints this month. Need rate limiting before it impacts uptime.",
    impactArea: "engineering",
    urgency: "critical",
    column: "backlog",
    requirements: [
      { id: "r-4", text: "Implement per-IP rate limiting (100 req/min)", completed: false },
      { id: "r-5", text: "Return proper 429 response with Retry-After header", completed: false },
    ],
    createdAt: "2026-02-02T12:00:00Z",
    updatedAt: "2026-02-02T12:00:00Z",
  },
];

let prjCounter = projects.length;
let tktCounter = tickets.length;

function nextPrjId(): string {
  prjCounter++;
  return `PRJ-${String(prjCounter).padStart(3, "0")}`;
}

function nextTktId(): string {
  tktCounter++;
  return `TKT-${String(tktCounter).padStart(3, "0")}`;
}

// ---- Request API ----

export function getAllRequests(): IntakeRequest[] {
  return [...requests].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function getRequestById(id: string): IntakeRequest | undefined {
  return requests.find((r) => r.id === id);
}

export function createRequest(data: {
  title: string;
  businessContext: string;
  impactArea: ImpactArea;
  urgency: Urgency;
  requesterName: string;
}): IntakeRequest {
  const now = new Date().toISOString();
  const req: IntakeRequest = {
    id: nextReqId(),
    ...data,
    status: "new",
    createdAt: now,
    updatedAt: now,
  };
  requests.push(req);
  return req;
}

const actionToStatus: Record<ReviewAction, RequestStatus> = {
  accept: "accepted",
  defer: "deferred",
  reject: "rejected",
  clarify: "under_review",
};

export function reviewRequest(
  id: string,
  action: ReviewAction,
  note?: string,
): IntakeRequest | undefined {
  const req = requests.find((r) => r.id === id);
  if (!req) return undefined;
  req.status = actionToStatus[action];
  req.reviewNote = note || req.reviewNote;
  req.updatedAt = new Date().toISOString();
  return req;
}

// ---- Project API ----

export function getAllProjects(): Project[] {
  return [...projects].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function getProjectById(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}

export function createProject(data: {
  name: string;
  description?: string;
}): Project {
  const prj: Project = {
    id: nextPrjId(),
    name: data.name,
    description: data.description,
    archived: false,
    createdAt: new Date().toISOString(),
  };
  projects.push(prj);
  return prj;
}

export function archiveProject(id: string): Project | undefined {
  const prj = projects.find((p) => p.id === id);
  if (!prj) return undefined;
  prj.archived = !prj.archived;
  return prj;
}

// ---- Ticket API ----

export function getTicketsByProject(projectId: string): Ticket[] {
  return tickets.filter((t) => t.projectId === projectId);
}

export function getTicketById(id: string): Ticket | undefined {
  return tickets.find((t) => t.id === id);
}

/** Check if an intake request has already been converted to a ticket */
export function getTicketByIntakeId(intakeRequestId: string): Ticket | undefined {
  return tickets.find((t) => t.intakeRequestId === intakeRequestId);
}

export function convertToTicket(data: {
  projectId: string;
  intakeRequestId: string;
}): Ticket | undefined {
  const req = requests.find((r) => r.id === data.intakeRequestId);
  if (!req || req.status !== "accepted") return undefined;

  // Prevent duplicate conversion
  const existing = tickets.find(
    (t) => t.intakeRequestId === data.intakeRequestId,
  );
  if (existing) return existing;

  const now = new Date().toISOString();
  const ticket: Ticket = {
    id: nextTktId(),
    projectId: data.projectId,
    intakeRequestId: data.intakeRequestId,
    title: req.title,
    businessContext: req.businessContext,
    impactArea: req.impactArea,
    urgency: req.urgency,
    column: "backlog",
    requirements: [],
    createdAt: now,
    updatedAt: now,
  };
  tickets.push(ticket);
  return ticket;
}

export function moveTicket(
  id: string,
  column: BoardColumn,
): Ticket | undefined {
  const ticket = tickets.find((t) => t.id === id);
  if (!ticket) return undefined;
  ticket.column = column;
  ticket.updatedAt = new Date().toISOString();
  return ticket;
}

export function assignTicket(
  id: string,
  assignee: string | undefined,
): Ticket | undefined {
  const ticket = tickets.find((t) => t.id === id);
  if (!ticket) return undefined;
  ticket.assignee = assignee;
  ticket.updatedAt = new Date().toISOString();
  return ticket;
}

/** Count tickets per project (for list view) */
export function getTicketCountByProject(
  projectId: string,
): { total: number; done: number } {
  const projectTickets = tickets.filter((t) => t.projectId === projectId);
  return {
    total: projectTickets.length,
    done: projectTickets.filter((t) => t.column === "done").length,
  };
}

// ---- Requirement API ----

let reqIdCounter = 5; // after seed r-1..r-5

export function addRequirement(
  ticketId: string,
  text: string,
): Ticket | undefined {
  const ticket = tickets.find((t) => t.id === ticketId);
  if (!ticket) return undefined;
  reqIdCounter++;
  ticket.requirements.push({
    id: `r-${reqIdCounter}`,
    text,
    completed: false,
  });
  ticket.updatedAt = new Date().toISOString();
  return ticket;
}

export function toggleRequirement(
  ticketId: string,
  requirementId: string,
): Ticket | undefined {
  const ticket = tickets.find((t) => t.id === ticketId);
  if (!ticket) return undefined;
  const req = ticket.requirements.find((r) => r.id === requirementId);
  if (!req) return undefined;
  req.completed = !req.completed;
  ticket.updatedAt = new Date().toISOString();
  return ticket;
}

export function removeRequirement(
  ticketId: string,
  requirementId: string,
): Ticket | undefined {
  const ticket = tickets.find((t) => t.id === ticketId);
  if (!ticket) return undefined;
  ticket.requirements = ticket.requirements.filter(
    (r) => r.id !== requirementId,
  );
  ticket.updatedAt = new Date().toISOString();
  return ticket;
}
