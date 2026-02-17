"use client";

import React from "react";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { BOARD_COLUMNS } from "@/types";
import { AppHeader } from "@/components/AppHeader/AppHeader";
import { UrgencyIndicator } from "@/components/UrgencyIndicator/UrgencyIndicator";
import { AssignForm } from "@/components/AssignForm/AssignForm";
import { RequirementsList } from "@/components/RequirementsList/RequirementsList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";

const impactLabels: Record<string, string> = {
  product: "Product",
  engineering: "Engineering",
  operations: "Operations",
  design: "Design",
  other: "Other",
};

const columnLabel = Object.fromEntries(
  BOARD_COLUMNS.map((c) => [c.key, c.label]),
);

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function TicketDetailClient() {
  const params = useParams();
  const projectId = params.id as Id<"projects">;
  const ticketId = params.ticketId as Id<"tickets">;

  const ticket = useQuery(api.tickets.get, { id: ticketId });
  const project = useQuery(api.projects.get, { id: projectId });
  const originalRequest = useQuery(
    api.requests.get,
    ticket?.intakeRequestId ? { id: ticket.intakeRequestId } : "skip",
  );

  if (ticket === undefined || project === undefined) {
    return (
      <div className="min-h-screen">
        <AppHeader />
        <main className="mx-auto max-w-3xl px-4 py-8">
          <p className="text-muted-foreground">Loading…</p>
        </main>
      </div>
    );
  }

  if (ticket === null || project === null || ticket.projectId !== projectId) {
    return (
      <div className="min-h-screen">
        <AppHeader />
        <main className="mx-auto max-w-3xl px-4 py-8">
          <p className="text-muted-foreground">Ticket not found.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <Link
          href={`/projects/${projectId}`}
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to {project.name}
        </Link>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-sm text-muted-foreground">
                {String(ticket.id)}
              </span>
              <Badge variant="outline">{columnLabel[ticket.column]}</Badge>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-balance">
              {ticket.title}
            </h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Ticket Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-0.5">
                  <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Impact Area
                  </dt>
                  <dd className="text-sm text-foreground">
                    {impactLabels[ticket.impactArea]}
                  </dd>
                </div>
                <div className="flex flex-col gap-0.5">
                  <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Urgency
                  </dt>
                  <dd>
                    <UrgencyIndicator urgency={ticket.urgency} />
                  </dd>
                </div>
                <div className="flex flex-col gap-0.5">
                  <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Status
                  </dt>
                  <dd className="text-sm text-foreground">
                    {columnLabel[ticket.column]}
                  </dd>
                </div>
                <div className="flex flex-col gap-0.5">
                  <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Created
                  </dt>
                  <dd className="text-sm text-foreground">
                    {formatDateTime(ticket.createdAt)}
                  </dd>
                </div>
              </dl>

              <div className="mt-6 border-t pt-4">
                <AssignForm
                  ticketId={ticket.id}
                  projectId={projectId}
                  currentAssignee={ticket.assignee}
                />
              </div>
            </CardContent>
          </Card>

          <RequirementsList
            ticketId={ticket.id}
            projectId={projectId}
            requirements={ticket.requirements}
          />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-4 w-4 text-muted-foreground" />
                {ticket.intakeRequestId ? "Original Intake Context" : "Description"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                {ticket.businessContext || "No description."}
              </p>
              {originalRequest && (
                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <span>
                    Source:{" "}
                    <Link
                      href={`/requests/${originalRequest.id}`}
                      className="text-primary underline-offset-4 hover:underline"
                    >
                      {String(originalRequest.id)}
                    </Link>
                  </span>
                  <span>
                    Requested by {originalRequest.requesterName}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
