import ForumHeader from "@/components/web/discussion-forums/ForumHeader";
import React from "react";

export const DiscussionLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <main className="w-full min-h-screen bg-white z-[999] absolute top-0 left-0">
      <ForumHeader />
      <div className="min-[1690px]:mt-[100px] lg:mt-[200px] md:mt-[150px] mt-[200px]">{children}</div>
    </main>
  );
};
