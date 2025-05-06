import PrimaryButton from "@/components/addons/buttons/PrimaryButton";
import { useRouter } from "next/navigation";
import React from "react";
import Image from "next/image";
import { catgeoryDiscussion } from "../data";

const DiscussionCategory = () => {
  const router = useRouter();

  return (
    <div className="w-full py-12 space-y-6">
      <h2 className="xl:max-w-[500px] py-9 w-full font-montserrat font-bold lg:text-[44px] md:text-4xl xl:text-left text-center text-3xl text-primary !leading-normal">
        Categories
      </h2>

      <div className="w-full grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-10">
        {catgeoryDiscussion.map((item) => (
          <div
            key={item.id}
            className="min-h-[247px] space-y-3.5 rounded-[35px] shadow-slider-card bg-white p-8 font-roboto"
          >
            <div className="flex items-center justify-between">
              <Image
                src={item.img}
                alt={item.title}
                fill
                className="!relative max-w-[68px] !h-fit"
              />

              <p className="text-textdark md:text-xl text-lg font-medium font-roboto">
                {item.topics} Topics
              </p>
            </div>

            <h4 className="text-textdark lg:text-3xl md:text-2xl text-xl font-roboto font-semibold">
              {item.title}
            </h4>

            <p className="text-textlight md:text-lg text-base font-roboto">
              {item.desc}
            </p>

            <PrimaryButton
              text="Join the Discussion"
              className="!px-5 !py-2 w-fit lg:!text-lg shadow-button !rounded-[10px]"
              onClick={() => router.push(item.link)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiscussionCategory;
