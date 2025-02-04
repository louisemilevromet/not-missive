"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paperclip, Send } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export const FormChat: React.FC<{
  conversationId: string;
  myUser: any;
}> = ({ conversationId, myUser }) => {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sendMessage = useMutation(api.chats.sendMessage);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() || file) {
      setMessage("");
      setFile(null);
      sendMessage({
        conversationId: conversationId as Id<"conversations">,
        content: message,
        senderId: myUser._valueJSON.userId,
        type: file ? "image" : "text",
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 p-4 bg-background border-t border-border"
    >
      <div className="self-end h-10">
        <Input
          type="file"
          onChange={handleFileChange}
          className="hidden"
          ref={fileInputRef}
          accept="image/*"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-10 w-10"
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-grow space-y-2">
        {/* File preview */}
        {file && (
          <div className="flex items-center gap-2 p-2 bg-muted rounded-md border border-border w-fit">
            <img
              src={URL.createObjectURL(file)}
              alt="Preview"
              className="h-8 w-8 rounded-md object-cover border"
            />
            <span className="text-sm text-foreground truncate">
              {file.name}
            </span>
          </div>
        )}

        {/* Input container */}
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit" size="icon" className="h-10 w-10">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </form>
  );
};

export default FormChat;
