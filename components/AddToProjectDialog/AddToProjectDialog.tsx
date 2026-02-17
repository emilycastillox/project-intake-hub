"use client";

import React, { useState } from "react";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FolderPlus } from "lucide-react";

type ProjectShape = {
  id: Id<"projects">;
  name: string;
  description?: string;
  archived: boolean;
  createdAt: string;
};

interface Props {
  intakeRequestId: Id<"intakeRequests">;
  request: {
    title: string;
    businessContext: string;
    impactArea: string;
    urgency: string;
  };
  projects: ProjectShape[];
}

const AddToProjectDialog: React.FC<Props> = (props) => {
  const { intakeRequestId, request, projects } = props;
  const router = useRouter();
  const createProject = useMutation(api.projects.create);
  const createTicket = useMutation(api.tickets.createFromRequest);

  const [mode, setMode] = useState<"existing" | "new">(
    projects.length > 0 ? "existing" : "new",
  );
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [newProjectName, setNewProjectName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsPending(true);
    try {
      let projectId: Id<"projects">;
      if (mode === "existing" && selectedProjectId) {
        projectId = selectedProjectId as Id<"projects">;
      } else if (mode === "new" && newProjectName.trim()) {
        const p = await createProject({
          name: newProjectName.trim(),
        });
        projectId = p.id;
      } else {
        setError("Please select or create a project.");
        setIsPending(false);
        return;
      }
      await createTicket({
        projectId,
        intakeRequestId,
        title: request.title,
        businessContext: request.businessContext,
        impactArea: request.impactArea as "product" | "engineering" | "operations" | "design" | "other",
        urgency: request.urgency as "low" | "medium" | "high" | "critical",
      });
      router.push(`/projects/${projectId}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <FolderPlus className="mr-1.5 h-4 w-4" />
          Add to Project
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add to Project</DialogTitle>
          <DialogDescription>
            Convert this accepted request into a ticket on a project board.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}

          {projects.length > 0 && (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant={mode === "existing" ? "default" : "outline"}
                size="sm"
                onClick={() => setMode("existing")}
              >
                Existing Project
              </Button>
              <Button
                type="button"
                variant={mode === "new" ? "default" : "outline"}
                size="sm"
                onClick={() => setMode("new")}
              >
                New Project
              </Button>
            </div>
          )}

          {mode === "existing" && projects.length > 0 ? (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="projectId">Project</Label>
              <Select
                name="projectId"
                value={selectedProjectId}
                onValueChange={setSelectedProjectId}
                required
              >
                <SelectTrigger id="projectId">
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="newProjectName">New Project Name</Label>
              <Input
                id="newProjectName"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="e.g. Q1 Security Sprint"
                required
              />
            </div>
          )}

          <div className="flex justify-end">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Converting..." : "Convert to Ticket"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { AddToProjectDialog };
