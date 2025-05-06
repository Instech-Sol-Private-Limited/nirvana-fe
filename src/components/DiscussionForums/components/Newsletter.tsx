import Image from "next/image";
import React from "react";
import { join_forum } from "../../../../public";
import PrimaryButton from "@/components/addons/buttons/PrimaryButton";

const Newsletter = () => {
  return (
    <div className={`w-full flex items-center justify-between md:flex-row flex-col  md:mt-32 mt-20 py-10`}>
      <div className="2xl:w-1/2 w-full space-y-10">
        <h2 className="font-montserrat font-bold lg:text-[32px] md:text-[26px] text-2xl xl:text-left text-center text-primary !leading-normal">
          Have a question or want to share your insights? Join the forum today!
        </h2>

        <PrimaryButton
          text="Sign Up Now"
          className="!max-w-[287px] xl:!py-4 lg:!text-lg md:!text-base !text-sm"
        />
      </div>

      <div className="md:w-1/2 w-full flex justify-end">
        <Image
          src={join_forum}
          alt={"why_us"}
          fill
          className="!relative max-w-[500px]"
        />
      </div>
    </div>
  );
};

export default Newsletter;
