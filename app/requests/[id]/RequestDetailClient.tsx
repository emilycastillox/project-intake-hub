"use client";

import React from "react";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { AppHeader } from "@/components/AppHeader/AppHeader";
import { StatusBadge } from "@/components/StatusBadge/StatusBadge";
import { UrgencyIndicator } from "@/components/UrgencyIndicator/UrgencyIndicator";
import { ReviewPanel } from "@/components/ReviewPanel/ReviewPanel";
import { AddToProjectDialog } from "@/components/AddToProjectDialog/AddToProjectDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";

const impactLabels: Record<string, string> = {
  product: "Product",
  engineering: "Engineering",
  operations: "Operations",
  design: "Design",
  other: "Other",
};

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function RequestDetailClient() {
  const params = useParams();
  const id = params.id as Id<"intakeRequests">;
  const request = useQuery(api.requests.get, { id });
  const existingTicket = useQuery(api.tickets.getByIntakeRequest, {
    intakeRequestId: id,
  });
  const allProjects = useQuery(api.projects.list) ?? [];
  const activeProjects = allProjects.filter((p) => !p.archived);

  if (request === undefined) {
    return (
      <div className="min-h-screen">
        <AppHeader />
        <main className="mx-auto max-w-3xl px-4 py-8">
          <p className="text-muted-foreground">Loading…</p>
        </main>
      </div>
    );
  }

  if (request === null) {
    return (
      <div className="min-h-screen">
        <AppHeader />
        <main className="mx-auto max-w-3xl px-4 py-8">
          <p className="text-muted-foreground">Request not found.</p>
        </main>
      </div>
    );
  }

  const canReview =
    request.status === "new" || request.status === "under_review";
  const isAccepted = request.status === "accepted";

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-sm text-muted-foreground">
                {request.id}
              </span>
              <StatusBadge status={request.status} />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-balance">
              {request.title}
            </h1>

            {isAccepted && (
              <div className="mt-1">
                {existingTicket ? (
                  <Link
                    href={`/projects/${existingTicket.projectId}`}
                    className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline underline-offset-4"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    View on project board ({String(existingTicket.id)})
                  </Link>
                ) : (
                  <AddToProjectDialog
                    intakeRequestId={request.id}
                    request={{
                      title: request.title,
                      businessContext: request.businessContext,
                      impactArea: request.impactArea,
                      urgency: request.urgency,
                    }}
                    projects={activeProjects}
                  />
                )}
              </div>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Request Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-0.5">
                  <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Requester
                  </dt>
                  <dd className="text-sm font-medium text-foreground">
                    {request.requesterName}
                  </dd>
                </div>
                <div className="flex flex-col gap-0.5">
                  <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Impact Area
                  </dt>
                  <dd className="text-sm text-foreground">
                    {impactLabels[request.impactArea]}
                  </dd>
                </div>
                <div className="flex flex-col gap-0.5">
                  <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Urgency
                  </dt>
                  <dd>
                    <UrgencyIndicator urgency={request.urgency} />
                  </dd>
                </div>
                <div className="flex flex-col gap-0.5">
                  <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Submitted
                  </dt>
                  <dd className="text-sm text-foreground">
                    {formatDateTime(request.createdAt)}
                  </dd>
                </div>
              </dl>

              <div className="mt-6 flex flex-col gap-0.5">
                <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Business Context
                </dt>
                <dd className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                  {request.businessContext}
                </dd>
              </div>
            </CardContent>
          </Card>

          {request.reviewNote && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Reviewer Note</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-foreground">
                  {request.reviewNote}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Last updated {formatDateTime(request.updatedAt)}
                </p>
              </CardContent>
            </Card>
          )}

          {canReview && <ReviewPanel requestId={request.id} />}
        </div>
      </main>
    </div>
  );
}
