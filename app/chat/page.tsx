"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { CreateConversation } from "@/app/components/CreateConversation";
import Image from "next/image";
const ChatPage = () => {
  const [isCreateConversationOpen, setIsCreateConversationOpen] =
    useState(false);

  return (
    <div className="flex flex-col items-center justify-center h-full mx-auto">
      <div className="text-center">
        <Image
          src="/icon.png"
          alt="No conversation selected"
          width={48}
          height={48}
          className="mx-auto h-12 w-12 text-muted-foreground mb-4"
        />
        <h2 className="text-2xl font-semibold mb-2">
          No conversation selected
        </h2>
        <p className="text-muted-foreground mb-4">
          Choose a conversation or start a new one
        </p>
        <Button
          onClick={() => setIsCreateConversationOpen(true)}
          className="inline-flex items-center"
        >
          Start a new chat
        </Button>
      </div>

      <CreateConversation
        open={isCreateConversationOpen}
        onOpenChange={setIsCreateConversationOpen}
      />
    </div>
  );
};

export default ChatPage;
