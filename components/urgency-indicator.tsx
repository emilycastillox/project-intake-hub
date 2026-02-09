import type { Urgency } from "@/lib/types";
import { cn } from "@/lib/utils";

const config: Record<Urgency, { label: string; className: string }> = {
  low: { label: "Low", className: "text-muted-foreground" },
  medium: { label: "Medium", className: "text-[hsl(38,92%,45%)]" },
  high: { label: "High", className: "text-[hsl(25,95%,53%)]" },
  critical: { label: "Critical", className: "text-destructive font-semibold" },
};

export function UrgencyIndicator({ urgency }: { urgency: Urgency }) {
  const { label, className } = config[urgency];
  return <span className={cn("text-sm", className)}>{label}</span>;
}
