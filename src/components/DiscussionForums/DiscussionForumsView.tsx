import HeroBanner from "@/components/web/HeroBanner";
import React from "react";
import {
  DiscussionCategory,
  RecentDiscussions,
  PopularTopics,
  Newsletter,
} from "./components";
import WrapperContainer from "@/components/addons/containers/WrapperContainer";
import { bg_job_discussion } from "../../../public";

export const DiscussionForumsView = () => {
  return (
    <>
      <HeroBanner
        title="Our services can be tailored to your needs"
        desc={
          <>
            Choose the plan that suits you best – whether you're an institution
            looking to hire, a teacher seeking resources, or a school ready to
            grow. Transparent, affordable, and designed for the education
            community.
          </>
        }
        btntitle={"Join the Forum"}
        pageImg={bg_job_discussion}
      />

      <WrapperContainer innerClassName="pb-20">
        <DiscussionCategory />
        <RecentDiscussions />
        <PopularTopics />
        <Newsletter />
      </WrapperContainer>
    </>
  );
};
