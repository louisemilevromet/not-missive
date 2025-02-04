"use client";

import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface ChatListProps {
  myUser: any;
  conversationId: Id<"conversations">;
}

export const ChatList: React.FC<ChatListProps> = ({
  myUser,
  conversationId,
}) => {
  const messageEndRef = useRef<HTMLDivElement>(null);
  const messages = useQuery(api.chats.getMessages, { conversationId });

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!messages) return null;

  console.log(messages, "from chat list");

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-2">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex items-start gap-2.5",
              message.sender_userId === myUser._valueJSON.userId
                ? "justify-end"
                : "justify-start"
            )}
          >
            <div
              className={cn(
                "px-4 py-2 rounded-lg max-w-[70%]",
                message.sender_userId === myUser._valueJSON.userId
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              )}
            >
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>
    </div>
  );
};

export default ChatList;
