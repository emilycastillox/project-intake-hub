"use client";

import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

interface Props {
  projectId: Id<"projects">;
  /** Optional custom trigger; defaults to "+ Add ticket" link/button */
  trigger?: React.ReactNode;
}

const AddTicketDialog: React.FC<Props> = (props) => {
  const { projectId, trigger } = props;
  const createTicket = useMutation(api.tickets.create);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    setIsPending(true);
    try {
      await createTicket({
        projectId,
        title: title.trim(),
        businessContext: description.trim() || undefined,
      });
      setOpen(false);
      setTitle("");
      setDescription("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-md border border-dashed border-muted-foreground/30 bg-transparent px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:bg-muted/30 hover:text-foreground"
          >
            <Plus className="h-4 w-4" />
            Add ticket
          </button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add ticket</DialogTitle>
          <DialogDescription>
            Create a new task on this board. You can add details and requirements on the ticket page.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ticketTitle">Title</Label>
            <Input
              id="ticketTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Implement export feature"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ticketDescription">Description (optional)</Label>
            <Textarea
              id="ticketDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add context or acceptance criteria..."
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Adding…" : "Add ticket"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { AddTicketDialog };
