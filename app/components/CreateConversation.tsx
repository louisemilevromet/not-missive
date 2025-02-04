"use client";

import { useState, useCallback, useTransition } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@clerk/nextjs";
import debounce from "lodash/debounce";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";

interface CreateConversationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateConversation = ({
  open,
  onOpenChange,
}: CreateConversationProps) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(open);

  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      startTransition(() => {
        setDebouncedQuery(searchQuery);
      });
    }, 300),
    []
  );

  const createConversation = useMutation(api.chats.createOrGetConversation);

  const { userId } = useAuth();
  const users = useQuery(api.users.readUsers, {
    searchQuery: debouncedQuery,
    currentUserId: userId!,
  });

  const handleStartChat = async (selectedUserId: string) => {
    try {
      const conversationId = await createConversation({
        participantUserId: selectedUserId,
        currentUserId: userId!,
      });
      setIsOpen(false);
      onOpenChange(false);
      router.push(`/chat/${conversationId}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New chat</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <Input
            placeholder="Search users by name or email"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              debouncedSearch(e.target.value);
            }}
            className="col-span-3"
          />
          <div className="h-[300px] overflow-y-auto">
            {users?.map((user) => (
              <div
                key={user._id}
                className="flex items-center gap-3 px-4 py-3 hover:bg-[#e6eeff] cursor-pointer transition-colors duration-200 rounded-md"
                onClick={() => handleStartChat(user.userId)}
              >
                <Avatar>
                  <AvatarImage src={user.profileImage} alt={user.firstName} />
                  <AvatarFallback>{user.firstName[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-foreground truncate">
                    {user.firstName} {user.lastName}
                  </h3>
                </div>
              </div>
            ))}
            {users?.length === 0 && (
              <div className="text-center text-sm text-gray-500">
                No users found
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateConversation;
