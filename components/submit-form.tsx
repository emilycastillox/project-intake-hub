"use client";

import { useActionState } from "react";
import { submitRequest } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

export function SubmitForm() {
  const [error, action, isPending] = useActionState(
    async (_prev: string | null, formData: FormData) => {
      try {
        await submitRequest(formData);
        return null;
      } catch {
        return "All fields are required. Please fill in every field.";
      }
    },
    null,
  );

  return (
    <Card>
      <CardContent className="pt-6">
        <form action={action} className="flex flex-col gap-5">
          {error && (
            <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="requesterName">Your Name</Label>
            <Input
              id="requesterName"
              name="requesterName"
              placeholder="e.g. Sarah Chen"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="title">Request Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Short, descriptive title"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="businessContext">Business Context</Label>
            <Textarea
              id="businessContext"
              name="businessContext"
              placeholder="Why does this matter? What problem does it solve?"
              rows={4}
              required
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="impactArea">Impact Area</Label>
              <Select name="impactArea" required>
                <SelectTrigger id="impactArea">
                  <SelectValue placeholder="Select area" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="product">Product</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="operations">Operations</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="urgency">Urgency</Label>
              <Select name="urgency" required>
                <SelectTrigger id="urgency">
                  <SelectValue placeholder="Select urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
