"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
interface ChatHeaderProps {
  conversationId: Id<"conversations">;
  myUser: any;
}

const ChatHeader = ({ conversationId, myUser }: ChatHeaderProps) => {
  const deleteConversation = useMutation(api.chats.deleteConversation);
  const router = useRouter();
  console.log(myUser, "myUser in chat header");

  const handleDeleteConversation = (
    userId: string,
    conversationId: Id<"conversations">
  ) => {
    deleteConversation({
      userId,
      conversationId,
    });
    router.push("/chat");
  };

  return (
    <div className="bg-muted border-b flex justify-end items-center h-[64px] px-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <Button
            variant="destructive"
            onClick={() => {
              handleDeleteConversation(
                myUser._valueJSON.userId,
                conversationId
              );
            }}
          >
            Delete conversation
          </Button>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ChatHeader;
