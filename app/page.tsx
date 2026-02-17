"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AppHeader } from "@/components/AppHeader/AppHeader";
import { RequestTable } from "@/components/RequestTable/RequestTable";
import { StatusBadge } from "@/components/StatusBadge/StatusBadge";
import type { RequestStatus } from "@/types";

const statuses: RequestStatus[] = [
  "new",
  "under_review",
  "accepted",
  "deferred",
  "rejected",
];

interface Props {}

const DashboardPage: React.FC<Props> = (props) => {
  const {} = props;

  const requests = useQuery(api.requests.list) ?? [];

  const counts = statuses.reduce(
    (acc, s) => {
      acc[s] = requests.filter((r) => r.status === s).length;
      return acc;
    },
    {} as Record<RequestStatus, number>,
  );

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-balance">
            Intake Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Review and triage incoming work requests.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {statuses.map((s) => (
            <div key={s} className="flex items-center gap-1.5">
              <StatusBadge status={s} />
              <span className="text-sm font-medium tabular-nums text-foreground">
                {counts[s]}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <RequestTable requests={requests} />
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
