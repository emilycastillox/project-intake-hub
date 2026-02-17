import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const requestStatus = v.union(
  v.literal("new"),
  v.literal("under_review"),
  v.literal("accepted"),
  v.literal("deferred"),
  v.literal("rejected"),
);

const urgency = v.union(
  v.literal("low"),
  v.literal("medium"),
  v.literal("high"),
  v.literal("critical"),
);

const impactArea = v.union(
  v.literal("product"),
  v.literal("engineering"),
  v.literal("operations"),
  v.literal("design"),
  v.literal("other"),
);

const boardColumn = v.union(
  v.literal("backlog"),
  v.literal("in_progress"),
  v.literal("in_review"),
  v.literal("done"),
);

const requirement = v.object({
  id: v.string(),
  text: v.string(),
  completed: v.boolean(),
});

export default defineSchema({
  intakeRequests: defineTable({
    title: v.string(),
    businessContext: v.string(),
    impactArea,
    urgency,
    requesterName: v.string(),
    status: requestStatus,
    reviewNote: v.optional(v.string()),
    updatedAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_updated", ["updatedAt"]),

  projects: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    archived: v.boolean(),
  }).index("by_archived", ["archived"]),

  tickets: defineTable({
    projectId: v.id("projects"),
    /** Set when ticket was created from an accepted intake request; missing for ad-hoc board tickets */
    intakeRequestId: v.optional(v.id("intakeRequests")),
    title: v.string(),
    businessContext: v.string(),
    impactArea,
    urgency,
    column: boardColumn,
    assignee: v.optional(v.string()),
    requirements: v.array(requirement),
    updatedAt: v.number(),
  })
    .index("by_project", ["projectId"])
    .index("by_project_column", ["projectId", "column"])
    .index("by_intake_request", ["intakeRequestId"]),
});
