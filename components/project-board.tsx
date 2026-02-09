"use client";

import { useOptimistic, useTransition } from "react";
import type { Ticket, BoardColumn } from "@/lib/types";
import { BOARD_COLUMNS } from "@/lib/types";
import { BoardColumnComponent } from "./board-column";
import { moveTicketAction } from "@/lib/actions";

export function ProjectBoard({
  tickets: initialTickets,
  projectId,
}: {
  tickets: Ticket[];
  projectId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [tickets, setOptimisticTickets] = useOptimistic(
    initialTickets,
    (state: Ticket[], update: { ticketId: string; column: BoardColumn }) => {
      return state.map((t) =>
        t.id === update.ticketId ? { ...t, column: update.column } : t,
      );
    },
  );

  function handleDrop(ticketId: string, column: BoardColumn) {
    startTransition(async () => {
      setOptimisticTickets({ ticketId, column });
      await moveTicketAction(ticketId, column, projectId);
    });
  }

  function handleDragStart(_ticketId: string) {
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
        />
      ))}
    </div>
  );
}
