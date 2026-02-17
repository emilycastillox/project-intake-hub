"use client";

import React, { useState } from "react";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Clock, X, HelpCircle } from "lucide-react";

const actions = [
  {
    value: "accept" as const,
    label: "Accept",
    icon: Check,
    className: "bg-[hsl(142,71%,40%)] text-white hover:bg-[hsl(142,71%,35%)]",
  },
  {
    value: "defer" as const,
    label: "Defer",
    icon: Clock,
    className: "bg-muted text-foreground hover:bg-muted/80",
  },
  {
    value: "reject" as const,
    label: "Reject",
    icon: X,
    className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  },
  {
    value: "clarify" as const,
    label: "Request Clarification",
    icon: HelpCircle,
    className: "bg-[hsl(38,92%,50%)] text-white hover:bg-[hsl(38,92%,45%)]",
  },
];

interface Props {
  requestId: Id<"intakeRequests">;
}

const ReviewPanel: React.FC<Props> = (props) => {
  const { requestId } = props;
  const router = useRouter();
  const triage = useMutation(api.requests.triage);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [note, setNote] = useState("");

  async function handleSubmit(action: "accept" | "defer" | "reject" | "clarify") {
    setError(null);
    setIsPending(true);
    try {
      await triage({
        id: requestId,
        action,
        note: note.trim() || undefined,
      });
      router.refresh();
    } catch {
      setError("Failed to submit review. Please try again.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Triage This Request</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {error && (
            <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="note">Internal Note (optional)</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
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
                  type="button"
                  disabled={isPending}
                  className={a.className}
                  size="sm"
                  onClick={() => handleSubmit(a.value)}
                >
                  <Icon className="mr-1.5 h-4 w-4" />
                  {a.label}
                </Button>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { ReviewPanel };
