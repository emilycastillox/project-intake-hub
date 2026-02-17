"use client";

import React, { useOptimistic, useTransition } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import type { BoardColumn } from "@/types";
import { BOARD_COLUMNS } from "@/types";
import { BoardColumnComponent } from "@/components/BoardColumn/BoardColumn";
import { AddTicketDialog } from "@/components/AddTicketDialog/AddTicketDialog";

type TicketShape = {
  id: Id<"tickets">;
  projectId: Id<"projects">;
  intakeRequestId?: Id<"intakeRequests">;
  title: string;
  businessContext: string;
  impactArea: string;
  urgency: string;
  column: BoardColumn;
  assignee?: string;
  requirements: { id: string; text: string; completed: boolean }[];
  createdAt: string;
  updatedAt: string;
};

interface Props {
  tickets: TicketShape[];
  projectId: Id<"projects">;
}

const ProjectBoard: React.FC<Props> = (props) => {
  const { tickets: initialTickets, projectId } = props;
  const moveTicket = useMutation(api.tickets.move);

  const [isPending, startTransition] = useTransition();
  const [tickets, setOptimisticTickets] = useOptimistic(
    initialTickets,
    (state: TicketShape[], update: { ticketId: Id<"tickets">; column: BoardColumn }) => {
      return state.map((t) =>
        t.id === update.ticketId ? { ...t, column: update.column } : t,
      );
    },
  );

  function handleDrop(ticketId: Id<"tickets">, column: BoardColumn) {
    startTransition(async () => {
      setOptimisticTickets({ ticketId, column });
      await moveTicket({ id: ticketId, column });
    });
  }

  function handleDragStart(_ticketId: Id<"tickets">) {
    // placeholder for future drag feedback
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {BOARD_COLUMNS.map((col) => (
        <BoardColumnComponent
          key={col.key}
          columnKey={col.key}
          label={col.label}
          tickets={tickets.filter((t) => t.column === col.key)}
          onDrop={handleDrop}
          onDragStart={handleDragStart}
          addSlot={col.key === "backlog" ? <AddTicketDialog projectId={projectId} /> : undefined}
        />
      ))}
    </div>
  );
};

export { ProjectBoard };
