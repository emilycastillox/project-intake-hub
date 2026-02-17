import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.db.query("projects").collect();
    projects.sort((a, b) => b._creationTime - a._creationTime);
    return projects.map((p) => ({
      id: p._id,
      name: p.name,
      description: p.description,
      archived: p.archived,
      createdAt: new Date(p._creationTime).toISOString(),
    }));
  },
});

export const get = query({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    const p = await ctx.db.get(args.id);
    if (!p) return null;
    return {
      id: p._id,
      name: p.name,
      description: p.description,
      archived: p.archived,
      createdAt: new Date(p._creationTime).toISOString(),
    };
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("projects", {
      name: args.name,
      description: args.description,
      archived: false,
    });
    const p = await ctx.db.get(id);
    if (!p) throw new Error("Failed to create project");
    return {
      id: p._id,
      name: p.name,
      description: p.description,
      archived: p.archived,
      createdAt: new Date(p._creationTime).toISOString(),
    };
  },
});

export const ticketCounts = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const tickets = await ctx.db
      .query("tickets")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();
    return {
      total: tickets.length,
      done: tickets.filter((t) => t.column === "done").length,
    };
  },
});

export const listWithCounts = query({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.db.query("projects").collect();
    projects.sort((a, b) => b._creationTime - a._creationTime);
    const withCounts = await Promise.all(
      projects.map(async (p) => {
        const tickets = await ctx.db
          .query("tickets")
          .withIndex("by_project", (q) => q.eq("projectId", p._id))
          .collect();
        return {
          id: p._id,
          name: p.name,
          description: p.description,
          archived: p.archived,
          createdAt: new Date(p._creationTime).toISOString(),
          ticketCount: tickets.length,
          doneCount: tickets.filter((t) => t.column === "done").length,
        };
      }),
    );
    return withCounts;
  },
});
