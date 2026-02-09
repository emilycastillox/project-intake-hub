"use client";

import { useState, useActionState } from "react";
import { addToProjectAction } from "@/lib/actions";
import type { Project } from "@/lib/types";
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

export function AddToProjectDialog({
  intakeRequestId,
  projects,
}: {
  intakeRequestId: string;
  projects: Project[];
}) {
  const [mode, setMode] = useState<"existing" | "new">(
    projects.length > 0 ? "existing" : "new",
  );

  const [error, formAction, isPending] = useActionState(
    async (_prev: string | null, formData: FormData) => {
      try {
        await addToProjectAction(formData);
        return null;
      } catch (e) {
        return e instanceof Error ? e.message : "Something went wrong";
      }
    },
    null,
  );

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

        <form action={formAction} className="flex flex-col gap-4">
          <input
            type="hidden"
            name="intakeRequestId"
            value={intakeRequestId}
          />

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
              <Select name="projectId" required>
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
                name="newProjectName"
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
}
