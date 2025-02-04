import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    userId: v.string(),
    email: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    profileImage: v.string(),
  }).index("by_userId", ["userId"]),

  conversations: defineTable({
    participantOne: v.id("users"),
    participantTwo: v.id("users"),
    lastMessageId: v.optional(v.id("messages")),
    updatedAt: v.number(),
  })
    .index("by_participants", ["participantOne", "participantTwo"])
    .index("by_participantOne", ["participantOne"])
    .index("by_participantTwo", ["participantTwo"])
    .index("by_updatedAt", ["updatedAt"]),

  messages: defineTable({
    conversationId: v.id("conversations"),
    senderId: v.id("users"),
    content: v.string(),
    type: v.union(v.literal("text"), v.literal("image")),
    replyTo: v.optional(v.id("messages")),
    updatedAt: v.number(),
  })
    .index("by_conversationId", ["conversationId"])
    .index("by_senderId", ["senderId"])
    .index("by_updatedAt", ["updatedAt"]),

  media: defineTable({
    messageId: v.id("messages"),
    url: v.string(),
    type: v.union(v.literal("image")),
  })
    .index("by_messageId", ["messageId"])
    .index("by_type", ["type"]),
});
