import React from "react";
import { Badge } from "@/components/ui/badge";
import type { RequestStatus } from "@/types";
import { cn } from "@/utils";

const config: Record<
  RequestStatus,
  { label: string; className: string }
> = {
  new: {
    label: "New",
    className: "bg-[hsl(217,72%,50%)] text-white border-transparent",
  },
  under_review: {
    label: "Under Review",
    className: "bg-[hsl(38,92%,50%)] text-white border-transparent",
  },
  accepted: {
    label: "Accepted",
    className: "bg-[hsl(142,71%,40%)] text-white border-transparent",
  },
  deferred: {
    label: "Deferred",
    className: "bg-muted text-muted-foreground border-transparent",
  },
  rejected: {
    label: "Rejected",
    className: "bg-destructive text-destructive-foreground border-transparent",
  },
};

interface Props {
  status: RequestStatus;
}

const StatusBadge: React.FC<Props> = (props) => {
  const { status } = props;
  const { label, className } = config[status];

  return (
    <Badge className={cn("pointer-events-none", className)}>{label}</Badge>
  );
};

export { StatusBadge };
