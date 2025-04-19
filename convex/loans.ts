import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db
      .query("loans")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const create = mutation({
  args: {
    borrowerName: v.string(),
    amount: v.number(),
    interestRate: v.number(),
    term: v.number(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("loans", {
      userId,
      borrowerName: args.borrowerName,
      amount: args.amount,
      interestRate: args.interestRate,
      term: args.term,
      status: "pending",
      startDate: Date.now(),
      description: args.description,
    });
  },
});

export const update = mutation({
  args: {
    loanId: v.id("loans"),
    borrowerName: v.string(),
    amount: v.number(),
    interestRate: v.number(),
    term: v.number(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const loan = await ctx.db.get(args.loanId);
    if (!loan || loan.userId !== userId) {
      throw new Error("Loan not found or unauthorized");
    }

    await ctx.db.patch(args.loanId, {
      borrowerName: args.borrowerName,
      amount: args.amount,
      interestRate: args.interestRate,
      term: args.term,
      description: args.description,
    });
  },
});

export const updateStatus = mutation({
  args: {
    loanId: v.id("loans"),
    status: v.union(
      v.literal("pending"),
      v.literal("active"),
      v.literal("paid"),
      v.literal("defaulted")
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const loan = await ctx.db.get(args.loanId);
    if (!loan || loan.userId !== userId) {
      throw new Error("Loan not found or unauthorized");
    }

    await ctx.db.patch(args.loanId, { status: args.status });
  },
});

export const remove = mutation({
  args: {
    loanId: v.id("loans"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const loan = await ctx.db.get(args.loanId);
    if (!loan || loan.userId !== userId) {
      throw new Error("Loan not found or unauthorized");
    }

    await ctx.db.delete(args.loanId);
  },
});

export const get = query({
  args: { loanId: v.id("loans") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const loan = await ctx.db.get(args.loanId);
    if (!loan || loan.userId !== userId) {
      throw new Error("Loan not found or unauthorized");
    }
    return loan;
  },
});
