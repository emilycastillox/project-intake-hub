"use client";

import React, { useActionState } from "react";
import { assignTicketAction } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";

interface Props {
  ticketId: string;
  projectId: string;
  currentAssignee?: string;
}

const AssignForm: React.FC<Props> = (props) => {
  const { ticketId, projectId, currentAssignee } = props;

  const [, formAction, isPending] = useActionState(
    async (_prev: null, formData: FormData) => {
      const assignee = formData.get("assignee") as string;
      await assignTicketAction(ticketId, assignee, projectId);
      return null;
    },
    null,
  );

  return (
    <form action={formAction} className="flex items-end gap-2">
      <div className="flex flex-col gap-1.5 flex-1">
        <Label htmlFor="assignee" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Assignee
        </Label>
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground shrink-0" />
          <Input
            id="assignee"
            name="assignee"
            placeholder="Enter a name"
            defaultValue={currentAssignee || ""}
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
