import React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Lock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
const Loading = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prevProgress + 1;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col ">
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <Image src="/assets/icon.png" alt="logo" width={80} height={80} />
          <div className="text-center mb-4">
            <h1 className="text-xl font-bold mb-1">Not Missive</h1>
            <div className="flex items-center justify-center gap-2">
              <Lock className="w-4 h-4" />
              <span>End to end encrypted (not really 😂)</span>
            </div>
          </div>
          <div className="w-64">
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
