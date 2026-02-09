import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Inbox, Plus, Kanban } from "lucide-react";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 border-b bg-card">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-foreground"
          >
            <Inbox className="h-5 w-5 text-primary" />
            <span>Intake Hub</span>
          </Link>
          <nav className="flex items-center gap-1">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">Intake</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/projects">
                <Kanban className="mr-1.5 h-4 w-4" />
                Projects
              </Link>
            </Button>
          </nav>
        </div>
        <Button asChild size="sm">
          <Link href="/submit">
            <Plus className="mr-1.5 h-4 w-4" />
            New Request
          </Link>
        </Button>
      </div>
    </header>
  );
}
