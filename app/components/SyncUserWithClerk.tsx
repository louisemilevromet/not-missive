"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";

export const SyncUserWithClerk = () => {
  const { user } = useUser();
  const updateUser = useMutation(api.users.updateUser);

  useEffect(() => {
    if (!user) return;

    const syncUser = async () => {
      try {
        await updateUser({
          userId: user.id,
          email: user.emailAddresses[0].emailAddress ?? "",
          firstName: user.firstName ?? "",
          lastName: user.lastName ?? "",
          profileImage: user.imageUrl ?? "",
        });
      } catch (error) {
        throw Error("Failed to sync user with Clerk");
      }
    };

    syncUser();
  }, [user, updateUser]);

  return null;
};
