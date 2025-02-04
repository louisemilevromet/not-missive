import { auth } from "@clerk/nextjs/server";
import { api } from "@/convex/_generated/api";
import { preloadQuery } from "convex/nextjs";
import ChatLayoutWrapper from "@/app/components/ChatLayoutWrapper";
const ChatLayout = async ({ children }: { children: React.ReactNode }) => {
  const { userId } = await auth();
  const preloadedUserInfo = await preloadQuery(api.users.readUser, {
    userId: userId!,
  });
  const preloadedConversations = await preloadQuery(api.chats.getConversation, {
    userId: userId!,
  });
  return (
    <ChatLayoutWrapper
      preloadedUserInfo={preloadedUserInfo}
      preloadedConversations={preloadedConversations}
    >
      {children}
    </ChatLayoutWrapper>
  );
};

export default ChatLayout;
