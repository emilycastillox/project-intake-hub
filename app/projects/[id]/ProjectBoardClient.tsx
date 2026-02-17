"use client";

import React from "react";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { AppHeader } from "@/components/AppHeader/AppHeader";
import { ProjectBoard } from "@/components/ProjectBoard/ProjectBoard";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Archive } from "lucide-react";
import Link from "next/link";

export default function ProjectBoardClient() {
  const params = useParams();
  const projectId = params.id as Id<"projects">;
  const project = useQuery(api.projects.get, { id: projectId });
  const tickets = useQuery(api.tickets.listByProject, { projectId }) ?? [];

  if (project === undefined) {
    return (
      <div className="min-h-screen">
        <AppHeader />
        <main className="mx-auto max-w-6xl px-4 py-8">
          <p className="text-muted-foreground">Loading…</p>
        </main>
      </div>
    );
  }

  if (project === null) {
    return (
      <div className="min-h-screen">
        <AppHeader />
        <main className="mx-auto max-w-6xl px-4 py-8">
          <p className="text-muted-foreground">Project not found.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Link
          href="/projects"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          All projects
        </Link>

        <div className="flex flex-col gap-1 mb-6">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight text-balance">
              {project.name}
            </h1>
            {project.archived && (
              <Badge variant="secondary" className="gap-1">
                <Archive className="h-3 w-3" />
                Archived
              </Badge>
            )}
          </div>
          {project.description && (
            <p className="text-sm text-muted-foreground">
              {project.description}
            </p>
          )}
        </div>

        <ProjectBoard tickets={tickets} projectId={projectId} />
      </main>
    </div>
  );
}
