import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const updateUser = mutation({
  args: {
    userId: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    profileImage: v.optional(v.string()),
    email: v.optional(v.string()),
  },
  handler: async (
    ctx,
    { userId, firstName, lastName, profileImage, email }
  ) => {
    // Create a user constant to check if the user exists
    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    // If user does not exist, create a new user
    if (!user) {
      const newUser = await ctx.db.insert("users", {
        userId,
        firstName,
        lastName,
        profileImage: profileImage ?? "",
        email: email ?? "",
      });
      return newUser;
    }

    const updatedUser = await ctx.db.patch(user._id, {
      firstName,
      lastName,
      profileImage: profileImage ?? user.profileImage,
      email: email ?? user.email,
    });
    return updatedUser;
  },
});

export const readUser = query({
  args: {
    userId: v.string(),
  },
  handler: async ({ db }, args) => {
    const user = await db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
    return user;
  },
});

export const readUsers = query({
  args: {
    searchQuery: v.optional(v.string()),
    currentUserId: v.string(),
  },
  handler: async ({ db }, { searchQuery, currentUserId }) => {
    // Get all users except the current user
    const users = await db
      .query("users")
      .filter((q) => q.neq(q.field("userId"), currentUserId))
      .collect();

    if (!searchQuery) return users;

    const searchQueryLower = searchQuery.toLowerCase();

    return users
      .filter((user: any) => {
        const firstNameMatch = user?.firstName
          ?.toLowerCase()
          .includes(searchQueryLower);
        const lastNameMatch = user?.lastName
          ?.toLowerCase()
          .includes(searchQueryLower);
        const emailMatch = user?.email
          ?.toLowerCase()
          .includes(searchQueryLower);
        return firstNameMatch || lastNameMatch || emailMatch;
      })
      .slice(0, 10);
  },
});
