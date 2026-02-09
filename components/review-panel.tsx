"use client";

import { useActionState } from "react";
import { triageRequest } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Clock, X, HelpCircle } from "lucide-react";

const actions = [
  {
    value: "accept",
    label: "Accept",
    icon: Check,
    className: "bg-[hsl(142,71%,40%)] text-white hover:bg-[hsl(142,71%,35%)]",
  },
  {
    value: "defer",
    label: "Defer",
    icon: Clock,
    className: "bg-muted text-foreground hover:bg-muted/80",
  },
  {
    value: "reject",
    label: "Reject",
    icon: X,
    className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  },
  {
    value: "clarify",
    label: "Request Clarification",
    icon: HelpCircle,
    className: "bg-[hsl(38,92%,50%)] text-white hover:bg-[hsl(38,92%,45%)]",
  },
] as const;

export function ReviewPanel({ requestId }: { requestId: string }) {
  const [error, formAction, isPending] = useActionState(
    async (_prev: string | null, formData: FormData) => {
      try {
        await triageRequest(formData);
        return null;
      } catch {
        return "Failed to submit review. Please try again.";
      }
    },
    null,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Triage This Request</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-col gap-4">
          <input type="hidden" name="id" value={requestId} />

          {error && (
            <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="note">Internal Note (optional)</Label>
            <Textarea
              id="note"
              name="note"
              placeholder="Add context for the team..."
              rows={3}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {actions.map((a) => {
              const Icon = a.icon;
              return (
                <Button
                  key={a.value}
                  type="submit"
                  name="action"
                  value={a.value}
                  disabled={isPending}
                  className={a.className}
                  size="sm"
                >
                  <Icon className="mr-1.5 h-4 w-4" />
                  {a.label}
                </Button>
              );
            })}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
