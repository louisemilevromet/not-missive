import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const createOrGetConversation = mutation({
  args: {
    participantUserId: v.string(),
    currentUserId: v.string(),
  },
  handler: async (ctx, { participantUserId, currentUserId }) => {
    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", currentUserId))
      .first();

    const otherUser = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", participantUserId))
      .first();

    if (!currentUser || !otherUser) {
      throw new Error("User not found");
    }

    const existingConversation = await ctx.db
      .query("conversations")
      .filter((q) =>
        q.or(
          q.and(
            q.eq(q.field("participantOne"), currentUser._id),
            q.eq(q.field("participantTwo"), otherUser._id)
          ),
          q.and(
            q.eq(q.field("participantOne"), otherUser._id),
            q.eq(q.field("participantTwo"), currentUser._id)
          )
        )
      )
      .first();

    if (existingConversation) {
      return existingConversation?._id;
    }

    const conversationId = await ctx.db.insert("conversations", {
      participantOne: currentUser._id,
      participantTwo: otherUser._id,
      updatedAt: Date.now(),
    });

    return conversationId;
  },
});

export const sendMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    content: v.string(),
    senderId: v.string(),
    type: v.optional(v.union(v.literal("text"), v.literal("image"))),
  },
  handler: async (ctx, { conversationId, content, senderId, type }) => {
    const sender = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", senderId))
      .first();

    if (!sender) {
      throw new Error("Sender not found");
    }

    const messageId = await ctx.db.insert("messages", {
      conversationId,
      senderId: sender._id,
      content,
      type: type || "text",
      updatedAt: Date.now(),
    });

    await ctx.db.patch(conversationId, {
      lastMessageId: messageId,
      updatedAt: Date.now(),
    });

    return messageId;
  },
});

export const getConversation = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, { userId }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!user) {
      return [];
    }

    const conversations = await ctx.db
      .query("conversations")
      .filter((q) =>
        q.or(
          q.eq(q.field("participantOne"), user._id),
          q.eq(q.field("participantTwo"), user._id)
        )
      )
      .collect();

    const conversationsWithDetails = await Promise.all(
      conversations.map(async (conv) => {
        const otherParticipantId =
          conv.participantOne === user._id
            ? conv.participantTwo
            : conv.participantOne;

        const otherUser = await ctx.db.get(otherParticipantId);
        const lastMessage = conv.lastMessageId
          ? await ctx.db.get(conv.lastMessageId)
          : null;

        return {
          id: conv._id,
          name: otherUser?.firstName ?? "Unknown",
          chatImage: otherUser?.profileImage,
          lastMessage: lastMessage?.content ?? "",
          time: new Date(Number(conv.updatedAt)).toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "America/New_York",
          }),
          type: lastMessage?.type,
        };
      })
    );

    return conversationsWithDetails.sort((a: any, b: any) => b.time - a.time);
  },
});

export const getMessages = query({
  args: {
    conversationId: v.id("conversations"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("conversationId"), args.conversationId))
      .order("asc")
      .take(args.limit ?? 50);

    return await Promise.all(
      messages.map(async (msg) => {
        const sender = await ctx.db.get(msg.senderId);
        return {
          id: msg._id,
          sender_userId: sender?.userId,
          sender: sender?.firstName ?? "Unknown",
          content: msg.content,
          time: new Date(Number(msg.updatedAt)).toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "America/New_York",
          }),
          isSent: true,
          type: msg.type,
        };
      })
    );
  },
});

export const deleteConversation = mutation({
  args: {
    userId: v.string(),
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const conversation = await ctx.db.get(args.conversationId);

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    if (
      conversation.participantOne !== user._id &&
      conversation.participantTwo !== user._id
    ) {
      throw new Error("Unauthorized to delete this conversation");
    }

    const messages = await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("conversationId"), args.conversationId))
      .collect();

    await Promise.all(messages.map((message) => ctx.db.delete(message._id)));

    await ctx.db.delete(args.conversationId);

    return {
      success: true,
      deletedMessages: messages.length,
    };
  },
});

export const getConversationById = query({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, { conversationId }) => {
    const conversation = await ctx.db.get(conversationId);

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    const participantOne = await ctx.db.get(conversation.participantOne);
    const participantTwo = await ctx.db.get(conversation.participantTwo);
    const lastMessage = conversation.lastMessageId
      ? await ctx.db.get(conversation.lastMessageId)
      : null;

    return {
      ...conversation,
      participantOneDetails: participantOne,
      participantTwoDetails: participantTwo,
      lastMessageDetails: lastMessage,
      createdAt: new Date(conversation._creationTime).toLocaleDateString(),
      updatedAt: new Date(conversation.updatedAt).toLocaleDateString(),
    };
  },
});
