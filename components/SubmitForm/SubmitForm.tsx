"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
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

function getDisplayName(user: { firstName?: string | null; lastName?: string | null; fullName?: string | null }): string {
  if (user.fullName?.trim()) return user.fullName.trim();
  const first = user.firstName?.trim() ?? "";
  const last = user.lastName?.trim() ?? "";
  return [first, last].filter(Boolean).join(" ");
}

interface Props {}

const SubmitForm: React.FC<Props> = (props) => {
  const {} = props;
  const router = useRouter();
  const { user } = useUser();
  const createRequest = useMutation(api.requests.create);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [requesterName, setRequesterName] = useState("");

  useEffect(() => {
    if (user) {
      const name = getDisplayName(user);
      if (name) setRequesterName(name);
    }
  }, [user]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsPending(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const title = formData.get("title") as string;
    const businessContext = formData.get("businessContext") as string;
    const impactArea = formData.get("impactArea") as string;
    const urgency = formData.get("urgency") as string;
    const requesterNameValue = formData.get("requesterName") as string;
    if (!title?.trim() || !businessContext?.trim() || !impactArea || !urgency || !requesterNameValue?.trim()) {
      setError("All fields are required.");
      setIsPending(false);
      return;
    }
    try {
      await createRequest({
        title: title.trim(),
        businessContext: businessContext.trim(),
        impactArea: impactArea as "product" | "engineering" | "operations" | "design" | "other",
        urgency: urgency as "low" | "medium" | "high" | "critical",
        requesterName: requesterNameValue.trim(),
      });
      router.push("/");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
              value={requesterName}
              onChange={(e) => setRequesterName(e.target.value)}
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
};

export { SubmitForm };
