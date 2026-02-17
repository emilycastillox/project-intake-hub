"use client";

import React, { useState } from "react";
import type { Ticket, BoardColumn as BoardColumnType } from "@/types";
import { TicketCard } from "@/components/TicketCard/TicketCard";
import { cn } from "@/utils";

const columnColors: Record<BoardColumnType, string> = {
  backlog: "bg-muted-foreground",
  in_progress: "bg-[hsl(217,72%,50%)]",
  in_review: "bg-[hsl(38,92%,50%)]",
  done: "bg-[hsl(142,71%,40%)]",
};

interface Props {
  columnKey: BoardColumnType;
  label: string;
  tickets: Ticket[];
  onDrop: (ticketId: string, column: BoardColumnType) => void;
  onDragStart: (ticketId: string) => void;
  /** Rendered at the bottom of the column (e.g. "Add ticket" for backlog) */
  addSlot?: React.ReactNode;
}

const BoardColumnComponent: React.FC<Props> = (props) => {
  const { columnKey, label, tickets, onDrop, onDragStart, addSlot } = props;

  const [isDragOver, setIsDragOver] = useState(false);

  return (
    <div
      className={cn(
        "flex flex-col rounded-lg border bg-muted/30 transition-colors",
        isDragOver && "border-primary/50 bg-primary/5",
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragOver(false);
        const ticketId = e.dataTransfer.getData("text/plain");
        if (ticketId) {
          onDrop(ticketId, columnKey);
        }
      }}
    >
      <div className="flex items-center gap-2 px-3 py-2.5 border-b">
        <div
          className={cn(
            "h-2.5 w-2.5 rounded-full",
            columnColors[columnKey],
          )}
        />
        <h3 className="text-sm font-medium text-foreground">{label}</h3>
        <span className="ml-auto text-xs tabular-nums text-muted-foreground">
          {tickets.length}
        </span>
      </div>

      <div className="flex flex-col gap-2 p-2 min-h-[120px]">
        {tickets.map((ticket) => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            onDragStart={onDragStart}
          />
        ))}
        {addSlot}
      </div>
    </div>
  );
};

export { BoardColumnComponent };
