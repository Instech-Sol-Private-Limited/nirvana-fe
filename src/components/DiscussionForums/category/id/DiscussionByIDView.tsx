import React from "react";
import WrapperContainer from "@/components/addons/containers/WrapperContainer";
import DiscussionCard from "./components/DiscussionCard";

export const DiscussionByIDView = ({
  id,
  category,
}: {
  id: string;
  category: string;
}) => {
  return (
    <>
      <WrapperContainer innerClassName="pb-20 flex flex-col items-center gap-[30px] mt-[65px]">
        <DiscussionCard id={id} category={category} />
      </WrapperContainer>
    </>
  );
};
