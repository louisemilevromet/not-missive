import { useAuth } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Search, MessageCircle } from "lucide-react";
import Link from "next/link";
import { CreateConversation } from "@/app/components/CreateConversation";

export const Sidebar = ({
  userInfo,
  conversations,
}: {
  userInfo: any;
  conversations: any;
}) => {
  const pathName = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { signOut } = useAuth();
  const router = useRouter();

  const filteredConversations = conversations.filter(
    (conversation: any) =>
      conversation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full sm:w-[320px] md:w-[380px] lg:w-1/4 h-screen flex flex-col bg-background border-r border-border">
      {/* Header */}
      <div className="shrink-0 px-4 py-3 bg-muted flex justify-between items-center">
        <Link href="/profile">
          <Avatar className="w-8 h-8 rounded-full">
            <AvatarImage
              src={
                userInfo?.profileImage || "/placeholder.svg?height=40&width=40"
              }
              alt="Your avatar"
            />
          </Avatar>
        </Link>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10"
            onClick={() => setIsSearchOpen(true)}
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => {
                  signOut();
                  router.push("/");
                }}
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/* Search Input */}
      <div className="p-2 bg-background">
        <div className="relative bg-muted rounded-lg flex items-center">
          <div className="pl-4 pr-2 py-2">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          <input
            placeholder="Search or start new chat"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none text-foreground placeholder:text-muted-foreground focus:outline-none py-2 text-sm"
          />
        </div>
      </div>

      {/* Create Conversation Component */}
      <CreateConversation open={isSearchOpen} onOpenChange={setIsSearchOpen} />

      {/* Conversations list */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length > 0 ? (
          filteredConversations.map((conversation: any) => (
            <Link href={`/chat/${conversation.id}`} key={conversation.id}>
              <div
                key={conversation.id}
                className={`flex items-center gap-3 px-4 py-3 hover:bg-[#e6eeff] cursor-pointer transition-colors duration-200 ${
                  pathName.startsWith(`/chat/${conversation.id}`)
                    ? "bg-[#e6eeff]"
                    : ""
                }`}
              >
                <Avatar>
                  <AvatarImage
                    src={conversation.chatImage}
                    alt={conversation.name}
                  />
                  <AvatarFallback>{conversation.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-sm font-semibold text-foreground truncate">
                      {conversation.name}
                    </h3>
                    <span className="text-xs text-muted-foreground">
                      {conversation.time}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {conversation.lastMessage}
                  </p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">No conversations found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
