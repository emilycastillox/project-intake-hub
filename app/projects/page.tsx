import { getAllProjects, getTicketCountByProject } from "@/lib/store";
import { AppHeader } from "@/components/app-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Kanban, Archive } from "lucide-react";
import Link from "next/link";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-balance">
            Projects
          </h1>
          <p className="text-sm text-muted-foreground">
            Track accepted work across lightweight project boards.
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="mt-12 flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
            <Kanban className="h-10 w-10 text-muted-foreground/50" />
            <p className="mt-3 text-lg font-medium text-foreground">
              No projects yet
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Projects are created when you convert accepted intake requests
              into tickets.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {projects.map((project) => {
              const counts = getTicketCountByProject(project.id);
              return (
                <Link key={project.id} href={`/projects/${project.id}`}>
                  <Card className="group transition-colors hover:border-primary/40">
                    <CardContent className="flex flex-col gap-3 pt-5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-col gap-0.5">
                          <h2 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {project.name}
                          </h2>
                          {project.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {project.description}
                            </p>
                          )}
                        </div>
                        {project.archived && (
                          <Badge
                            variant="secondary"
                            className="shrink-0 gap-1"
                          >
                            <Archive className="h-3 w-3" />
                            Archived
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>
                          {counts.total}{" "}
                          {counts.total === 1 ? "ticket" : "tickets"}
                        </span>
                        {counts.total > 0 && (
                          <span>
                            {counts.done} done
                          </span>
                        )}
                        <span className="ml-auto">
                          Created {formatDate(project.createdAt)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
