import { auth } from "@clerk/nextjs/server";
import { api } from "@/convex/_generated/api";
import { preloadQuery } from "convex/nextjs";
import Profile from "@/app/components/Profile";

const page = async () => {
  const { userId } = await auth();
  const user = await preloadQuery(api.users.readUser, { userId: userId! });

  return (
    <div className="flex flex-col h-screen">
      <Profile user={user} />
    </div>
  );
};

export default page;
