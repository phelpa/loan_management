import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const applicationTables = {
  loans: defineTable({
    userId: v.id("users"),
    borrowerName: v.string(),
    amount: v.number(),
    interestRate: v.number(),
    term: v.number(), // in months
    status: v.union(
      v.literal("pending"),
      v.literal("active"),
      v.literal("paid"),
      v.literal("defaulted")
    ),
    startDate: v.number(), // timestamp
    description: v.string(),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
