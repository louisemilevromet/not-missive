"use client";

import { useAuth } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { usePreloadedQuery } from "convex/react";
import Loading from "@/app/components/Loading";
import { Sidebar } from "@/app/components/Sidebar";

const ChatLayoutWrapper = ({
  children,
  preloadedUserInfo,
  preloadedConversations,
}: {
  children: React.ReactNode;
  preloadedUserInfo: any;
  preloadedConversations: any;
}) => {
  const { isLoaded, isSignedIn } = useAuth();
  const [shouldShowLoading, setShouldShowLoading] = useState(true);

  const userInfo = usePreloadedQuery(preloadedUserInfo);
  const conversations = usePreloadedQuery(preloadedConversations);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldShowLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const isLoading =
    !isLoaded ||
    userInfo === undefined ||
    shouldShowLoading ||
    conversations === undefined;

  if (isLoading) {
    return <Loading />;
  }

  if (!isSignedIn) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar userInfo={userInfo} conversations={conversations} />
      {children}
    </div>
  );
};

export default ChatLayoutWrapper;
