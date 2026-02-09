# Intake Hub

A single flow to capture stakeholder requests, triage what’s feasible, and turn accepted work into tickets on a project board—all in one place.

---

## Why this exists

After too many projects where stakeholders didn’t know exactly what they wanted—or what was actually feasible—I needed a clear system:

- **One place** for incoming asks, so nothing gets lost in email or Slack.
- **A real triage step** so we can accept, defer, reject, or ask for clarification before anything becomes “a project.”
- **A simple path** from “we’re doing this” to tickets on a board, without copying things into Jira/Linear/Notion by hand.

Intake Hub is that flow: **submit a request → review and triage → accept → add to a project → manage tickets on a board.** Requirements and execution live in the same app.

---

## What it does

- **Submit a request** — Stakeholders submit work with title, business context, impact area (product, engineering, operations, design, other), and urgency. No more vague “we need a thing” messages.
- **Intake dashboard** — See all requests and their status: New, Under review, Accepted, Deferred, Rejected. Quick counts and a single list to triage from.
- **Triage each request** — Open a request and accept, defer, reject, or **request clarification**. Add internal notes so the team knows why something was accepted or not. This is where “what we’re actually doing” gets decided.
- **Turn accepted work into tickets** — For accepted requests, use “Add to Project” to create a ticket on an existing project or a new one. The ticket keeps the original request’s context (title, business context, impact, urgency).
- **Project boards** — Each project has a Kanban board: **Backlog → In Progress → In Review → Done**. Drag tickets between columns. Open a ticket to see requirements, assign someone, and track progress—all linked back to the original intake request.

So: **requirements + triage + project board + tickets**, in one app, with one flow.

---

## Features

| Area | What you get |
|------|----------------|
| **Intake** | Submit form (requester, title, business context, impact area, urgency). Intake dashboard with status counts and request list. |
| **Triage** | Per-request review: Accept / Defer / Reject / Request clarification. Optional reviewer notes. |
| **Projects** | Create projects, list them with ticket counts. “Add to Project” converts an accepted request into a ticket (existing or new project). |
| **Board** | Kanban with Backlog, In Progress, In Review, Done. Drag-and-drop to move tickets. |
| **Tickets** | Ticket detail with requirements list, assignee, link back to original intake request. |

---

## Screenshots

**Intake dashboard** — Review and triage incoming requests by status (New, Under review, Accepted, Deferred, Rejected).

![Intake Dashboard](docs/screenshots/dashboard.png)

**Request detail** — See full context and triage with Accept, Defer, Reject, or Request clarification.

![Request detail and triage](docs/screenshots/request-detail.png)

**Projects** — Track accepted work across lightweight project boards.

![Projects list](docs/screenshots/projects.png)

**Project board** — Kanban with Backlog, In Progress, In Review, Done. Drag tickets between columns.

![Project board](docs/screenshots/board.png)

**Ticket detail** — Requirements/success criteria, assignee, and original intake context in one place.

![Ticket detail](docs/screenshots/ticket-detail.png)

---

## Tech stack

- **Next.js 16** (App Router), **React 19**
- **TypeScript**
- **Tailwind CSS**, **Radix UI** (shadcn/ui-style components)
- **In-memory store** — data lives in server memory; resets on restart. Swap in a DB when you’re ready.

---

## Getting started

```bash
# Install dependencies (pnpm or npm)
pnpm install

# Run the dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). You’ll see the Intake dashboard, with nav to **Intake**, **Projects**, and **New Request**.

**Quick runthrough:** Submit a request at `/submit` → open it from the dashboard → triage (e.g. Accept) → “Add to Project” to create a ticket → open the project to use the board and tickets.

---

## Project structure (high level)

- `app/` — Routes: `/` (dashboard), `/submit`, `/requests/[id]`, `/projects`, `/projects/[id]` (board), `/projects/[id]/tickets/[ticketId]`
- `components/` — UI: submit form, request table, review panel, add-to-project dialog, project board (columns + ticket cards), requirements list, assign form
- `lib/` — Types, in-memory store, server actions (submit, triage, add to project, move ticket, etc.)

---

## License

Private / unlicensed. Use and modify as you like.
