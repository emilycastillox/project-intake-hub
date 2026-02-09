import React from "react";
import type { Urgency } from "@/types";
import { cn } from "@/utils";

const config: Record<Urgency, { label: string; className: string }> = {
  low: { label: "Low", className: "text-muted-foreground" },
  medium: { label: "Medium", className: "text-[hsl(38,92%,45%)]" },
  high: { label: "High", className: "text-[hsl(25,95%,53%)]" },
  critical: { label: "Critical", className: "text-destructive font-semibold" },
};

interface Props {
  urgency: Urgency;
}

const UrgencyIndicator: React.FC<Props> = (props) => {
  const { urgency } = props;
  const { label, className } = config[urgency];

  return <span className={cn("text-sm", className)}>{label}</span>;
};

export { UrgencyIndicator };
