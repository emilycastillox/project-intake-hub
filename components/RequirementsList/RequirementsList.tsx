"use client";

import React, { useRef } from "react";
import type { Requirement } from "@/types";
import {
  addRequirementAction,
  toggleRequirementAction,
  removeRequirementAction,
} from "@/lib/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ListChecks, Plus, X } from "lucide-react";

interface Props {
  ticketId: string;
  projectId: string;
  requirements: Requirement[];
}

const RequirementsList: React.FC<Props> = (props) => {
  const { ticketId, projectId, requirements } = props;

  const inputRef = useRef<HTMLInputElement>(null);

  const completedCount = requirements.filter((r) => r.completed).length;
  const totalCount = requirements.length;
  const progressPct = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  async function handleAdd(formData: FormData) {
    const text = formData.get("text") as string;
    if (!text?.trim()) return;
    await addRequirementAction(ticketId, text, projectId);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function handleToggle(requirementId: string) {
    await toggleRequirementAction(ticketId, requirementId, projectId);
  }

  async function handleRemove(requirementId: string) {
    await removeRequirementAction(ticketId, requirementId, projectId);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <ListChecks className="h-4 w-4 text-muted-foreground" />
            Requirements / Success Criteria
          </CardTitle>
          {totalCount > 0 && (
            <span className="text-xs font-medium text-muted-foreground">
              {completedCount} of {totalCount} met
            </span>
          )}
        </div>
        {totalCount > 0 && (
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        )}
      </CardHeader>
      <CardContent>
        {totalCount > 0 ? (
          <ul className="flex flex-col gap-1.5">
            {requirements.map((req) => (
              <li key={req.id} className="group flex items-start gap-2.5 rounded-md px-2 py-1.5 hover:bg-muted/50 transition-colors">
                <button
                  type="button"
                  onClick={() => handleToggle(req.id)}
                  className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-border transition-colors hover:border-primary"
                  aria-label={req.completed ? "Mark incomplete" : "Mark complete"}
                >
                  {req.completed && (
                    <svg
                      className="h-3 w-3 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>
                <span
                  className={`flex-1 text-sm leading-relaxed ${
                    req.completed
                      ? "text-muted-foreground line-through"
                      : "text-foreground"
                  }`}
                >
                  {req.text}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemove(req.id)}
                  className="shrink-0 rounded p-0.5 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                  aria-label="Remove requirement"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            No requirements added yet. Add criteria below to track success.
          </p>
        )}

        <form action={handleAdd} className="mt-4 flex items-center gap-2">
          <Input
            ref={inputRef}
            name="text"
            placeholder="Add a requirement..."
            className="flex-1 text-sm"
          />
          <Button type="submit" size="sm" variant="outline" className="shrink-0 gap-1 bg-transparent">
            <Plus className="h-3.5 w-3.5" />
            Add
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export { RequirementsList };
