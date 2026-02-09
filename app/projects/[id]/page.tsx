import { notFound } from "next/navigation";
import { getProjectById, getTicketsByProject } from "@/lib/store";
import { AppHeader } from "@/components/AppHeader/AppHeader";
import { ProjectBoard } from "@/components/ProjectBoard/ProjectBoard";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Archive } from "lucide-react";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProjectBoardPage(props: Props) {
  const { params } = props;
  const { id } = await params;
  const project = getProjectById(id);

  if (!project) {
    notFound();
  }

  const tickets = getTicketsByProject(project.id);

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

        {tickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
            <p className="text-lg font-medium text-foreground">
              No tickets yet
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Convert accepted intake requests to add tickets to this board.
            </p>
          </div>
        ) : (
          <ProjectBoard tickets={tickets} projectId={project.id} />
        )}
      </main>
    </div>
  );
}
