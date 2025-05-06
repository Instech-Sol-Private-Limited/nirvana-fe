import React from "react";
import WrapperContainer from "@/components/addons/containers/WrapperContainer";
import Discussions from "./components/Discussions";

export const DiscussionCategoryView = ({ category }: { category: string }) => {
  return (
    <>
      <WrapperContainer innerClassName="bg-white pb-20 flex flex-col items-center gap-[30px]">
        <Discussions category={category} />
      </WrapperContainer>
    </>
  );
};
