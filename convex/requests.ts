import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const requestStatus = v.union(
  v.literal("new"),
  v.literal("under_review"),
  v.literal("accepted"),
  v.literal("deferred"),
  v.literal("rejected"),
);

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

export const list = query({
  args: {},
  handler: async (ctx) => {
    const requests = await ctx.db
      .query("intakeRequests")
      .withIndex("by_updated")
      .order("desc")
      .collect();
    return requests.map((r) => ({
      id: r._id,
      title: r.title,
      businessContext: r.businessContext,
      impactArea: r.impactArea,
      urgency: r.urgency,
      requesterName: r.requesterName,
      status: r.status,
      reviewNote: r.reviewNote,
      createdAt: new Date(r._creationTime).toISOString(),
      updatedAt: new Date(r.updatedAt).toISOString(),
    }));
  },
});

export const get = query({
  args: { id: v.id("intakeRequests") },
  handler: async (ctx, args) => {
    const r = await ctx.db.get(args.id);
    if (!r) return null;
    return {
      id: r._id,
      title: r.title,
      businessContext: r.businessContext,
      impactArea: r.impactArea,
      urgency: r.urgency,
      requesterName: r.requesterName,
      status: r.status,
      reviewNote: r.reviewNote,
      createdAt: new Date(r._creationTime).toISOString(),
      updatedAt: new Date(r.updatedAt).toISOString(),
    };
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    businessContext: v.string(),
    impactArea,
    urgency,
    requesterName: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const id = await ctx.db.insert("intakeRequests", {
      ...args,
      status: "new",
      updatedAt: now,
    });
    const r = await ctx.db.get(id);
    if (!r) throw new Error("Failed to create request");
    return {
      id: r._id,
      title: r.title,
      businessContext: r.businessContext,
      impactArea: r.impactArea,
      urgency: r.urgency,
      requesterName: r.requesterName,
      status: r.status,
      reviewNote: r.reviewNote,
      createdAt: new Date(r._creationTime).toISOString(),
      updatedAt: new Date(r.updatedAt).toISOString(),
    };
  },
});

const reviewAction = v.union(
  v.literal("accept"),
  v.literal("defer"),
  v.literal("reject"),
  v.literal("clarify"),
);

const actionToStatus = {
  accept: "accepted" as const,
  defer: "deferred" as const,
  reject: "rejected" as const,
  clarify: "under_review" as const,
};

export const triage = mutation({
  args: {
    id: v.id("intakeRequests"),
    action: reviewAction,
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const r = await ctx.db.get(args.id);
    if (!r) throw new Error("Request not found");
    const status = actionToStatus[args.action];
    await ctx.db.patch(args.id, {
      status,
      reviewNote: args.note ?? r.reviewNote,
      updatedAt: Date.now(),
    });
    const updated = await ctx.db.get(args.id);
    if (!updated) throw new Error("Request not found after patch");
    return {
      id: updated._id,
      title: updated.title,
      businessContext: updated.businessContext,
      impactArea: updated.impactArea,
      urgency: updated.urgency,
      requesterName: updated.requesterName,
      status: updated.status,
      reviewNote: updated.reviewNote,
      createdAt: new Date(updated._creationTime).toISOString(),
      updatedAt: new Date(updated.updatedAt).toISOString(),
    };
  },
});
