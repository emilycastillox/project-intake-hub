"use client";

import type { Ticket, BoardColumn } from "@/lib/types";
import { UrgencyIndicator } from "@/components/urgency-indicator";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";
import Link from "next/link";

export function TicketCard({
  ticket,
  onDragStart,
}: {
  ticket: Ticket;
  onDragStart: (ticketId: string) => void;
}) {
  return (
    <Card
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", ticket.id);
        onDragStart(ticket.id);
      }}
      className="cursor-grab active:cursor-grabbing group transition-shadow hover:shadow-md"
    >
      <CardContent className="flex flex-col gap-2 p-3">
        <Link
          href={`/projects/${ticket.projectId}/tickets/${ticket.id}`}
          className="text-sm font-medium text-foreground group-hover:text-primary transition-colors underline-offset-4 hover:underline"
        >
          {ticket.title}
        </Link>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-muted-foreground">
              {ticket.id}
            </span>
            <UrgencyIndicator urgency={ticket.urgency} />
          </div>
          {ticket.assignee && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <User className="h-3 w-3" />
              <span className="max-w-[80px] truncate">{ticket.assignee}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
