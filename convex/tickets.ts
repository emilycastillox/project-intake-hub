import { v } from "convex/values";
import type { Doc } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

const impactArea = v.union(
  v.literal("product"),
  v.literal("engineering"),
  v.literal("operations"),
  v.literal("design"),
  v.literal("other"),
);

const urgency = v.union(
  v.literal("low"),
  v.literal("medium"),
  v.literal("high"),
  v.literal("critical"),
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

function ticketToShape(t: Doc<"tickets">) {
  return {
    id: t._id,
    projectId: t.projectId,
    intakeRequestId: t.intakeRequestId,
    title: t.title,
    businessContext: t.businessContext,
    impactArea: t.impactArea,
    urgency: t.urgency,
    column: t.column,
    assignee: t.assignee,
    requirements: t.requirements,
    createdAt: new Date(t._creationTime).toISOString(),
    updatedAt: new Date(t.updatedAt).toISOString(),
  };
}

export const listByProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const tickets = await ctx.db
      .query("tickets")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();
    return tickets.map(ticketToShape);
  },
});

export const get = query({
  args: { id: v.id("tickets") },
  handler: async (ctx, args) => {
    const t = await ctx.db.get(args.id);
    if (!t) return null;
    return ticketToShape(t);
  },
});

export const getByIntakeRequest = query({
  args: { intakeRequestId: v.id("intakeRequests") },
  handler: async (ctx, args) => {
    const t = await ctx.db
      .query("tickets")
      .withIndex("by_intake_request", (q) =>
        q.eq("intakeRequestId", args.intakeRequestId),
      )
      .first();
    if (!t) return null;
    return ticketToShape(t);
  },
});

/** Create a ticket directly on the board (no intake request). Asana-style quick add. */
export const create = mutation({
  args: {
    projectId: v.id("projects"),
    title: v.string(),
    businessContext: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const id = await ctx.db.insert("tickets", {
      projectId: args.projectId,
      title: args.title.trim(),
      businessContext: args.businessContext?.trim() ?? "",
      impactArea: "other",
      urgency: "medium",
      column: "backlog",
      requirements: [],
      updatedAt: now,
    });
    const t = await ctx.db.get(id);
    if (!t) throw new Error("Failed to create ticket");
    return ticketToShape(t);
  },
});

export const createFromRequest = mutation({
  args: {
    projectId: v.id("projects"),
    intakeRequestId: v.id("intakeRequests"),
    title: v.string(),
    businessContext: v.string(),
    impactArea,
    urgency,
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("tickets")
      .withIndex("by_intake_request", (q) =>
        q.eq("intakeRequestId", args.intakeRequestId),
      )
      .first();
    if (existing) return ticketToShape(existing);

    const now = Date.now();
    const id = await ctx.db.insert("tickets", {
      projectId: args.projectId,
      intakeRequestId: args.intakeRequestId,
      title: args.title,
      businessContext: args.businessContext,
      impactArea: args.impactArea,
      urgency: args.urgency,
      column: "backlog",
      requirements: [],
      updatedAt: now,
    });
    const t = await ctx.db.get(id);
    if (!t) throw new Error("Failed to create ticket");
    return ticketToShape(t);
  },
});

export const move = mutation({
  args: {
    id: v.id("tickets"),
    column: boardColumn,
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { column: args.column, updatedAt: Date.now() });
    const t = await ctx.db.get(args.id);
    if (!t) throw new Error("Ticket not found");
    return ticketToShape(t);
  },
});

export const assign = mutation({
  args: {
    id: v.id("tickets"),
    assignee: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      assignee: args.assignee,
      updatedAt: Date.now(),
    });
    const t = await ctx.db.get(args.id);
    if (!t) throw new Error("Ticket not found");
    return ticketToShape(t);
  },
});

export const addRequirement = mutation({
  args: {
    ticketId: v.id("tickets"),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const t = await ctx.db.get(args.ticketId);
    if (!t) throw new Error("Ticket not found");
    const id = `r-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const requirements = [
      ...t.requirements,
      { id, text: args.text, completed: false },
    ];
    await ctx.db.patch(args.ticketId, {
      requirements,
      updatedAt: Date.now(),
    });
    const updated = await ctx.db.get(args.ticketId);
    if (!updated) throw new Error("Ticket not found");
    return ticketToShape(updated);
  },
});

export const toggleRequirement = mutation({
  args: {
    ticketId: v.id("tickets"),
    requirementId: v.string(),
  },
  handler: async (ctx, args) => {
    const t = await ctx.db.get(args.ticketId);
    if (!t) throw new Error("Ticket not found");
    const requirements = t.requirements.map((r) =>
      r.id === args.requirementId
        ? { ...r, completed: !r.completed }
        : r,
    );
    await ctx.db.patch(args.ticketId, {
      requirements,
      updatedAt: Date.now(),
    });
    const updated = await ctx.db.get(args.ticketId);
    if (!updated) throw new Error("Ticket not found");
    return ticketToShape(updated);
  },
});

export const removeRequirement = mutation({
  args: {
    ticketId: v.id("tickets"),
    requirementId: v.string(),
  },
  handler: async (ctx, args) => {
    const t = await ctx.db.get(args.ticketId);
    if (!t) throw new Error("Ticket not found");
    const requirements = t.requirements.filter((r) => r.id !== args.requirementId);
    await ctx.db.patch(args.ticketId, {
      requirements,
      updatedAt: Date.now(),
    });
    const updated = await ctx.db.get(args.ticketId);
    if (!updated) throw new Error("Ticket not found");
    return ticketToShape(updated);
  },
});
