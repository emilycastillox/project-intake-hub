"use client";

import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";

interface Props {
  ticketId: Id<"tickets">;
  projectId: Id<"projects">;
  currentAssignee?: string;
}

const AssignForm: React.FC<Props> = (props) => {
  const { ticketId, projectId, currentAssignee } = props;
  const assignTicket = useMutation(api.tickets.assign);
  const [assignee, setAssignee] = useState(currentAssignee ?? "");
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsPending(true);
    try {
      await assignTicket({
        id: ticketId,
        assignee: assignee.trim() || undefined,
      });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2">
      <div className="flex flex-col gap-1.5 flex-1">
        <Label htmlFor="assignee" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Assignee
        </Label>
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground shrink-0" />
          <Input
            id="assignee"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            placeholder="Enter a name"
            className="h-8 text-sm"
          />
        </div>
      </div>
      <Button type="submit" size="sm" variant="outline" disabled={isPending}>
        {isPending ? "Saving..." : "Assign"}
      </Button>
    </form>
  );
};

export { AssignForm };
