import { auth } from "@clerk/nextjs/server";
import { api } from "@/convex/_generated/api";
import { preloadQuery } from "convex/nextjs";
import { Id } from "@/convex/_generated/dataModel";
import { FormChat } from "@/app/components/FormChat";
import ChatList from "@/app/components/ChatList";
import ChatHeader from "@/app/components/ChatHeader";
const ChatPage = async ({ params }: { params: { id: string } }) => {
  const conversationId = params.id;
  const userData = await auth();

  const myUser = await preloadQuery(api.users.readUser, {
    userId: userData.userId!,
  });

  return (
    <div className="h-screen flex flex-col w-full">
      <div className="flex-1 flex flex-col overflow-hidden">
        <ChatHeader
          conversationId={conversationId as Id<"conversations">}
          myUser={myUser}
        />
        <div className="flex-1 overflow-y-auto p-4">
          <ChatList
            myUser={myUser}
            conversationId={conversationId as Id<"conversations">}
          />
        </div>

        <FormChat conversationId={conversationId} myUser={myUser} />
      </div>
    </div>
  );
};

export default ChatPage;
