import React from "react";
import { allDiscusssions } from "../../data";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { profile } from "../../../../../../public";
import PrimaryButton from "@/components/addons/buttons/PrimaryButton";
import ReplyIcon from "@/components/icons/ReplyIcon";
import LikeIcon from "@/components/icons/LikeIcon";
import DislikeIcon from "@/components/icons/DislikeIcon";
import Comments from "./Comments";

const DiscussionCard = ({ id, category }: { id: string; category: string }) => {
  const router = useRouter();
  const activeDiscussion = allDiscusssions.find(
    (item) => item.slug === category
  );
  const activeDiscussionItem = activeDiscussion?.discussions.find(
    (item) => item.id === Number(id)
  );

  return (
    <div className="max-w-[906px] w-full">
      <FaArrowLeftLong
        className="text-2xl cursor-pointer mb-3"
        onClick={() => router.push(`/${category}`)}
      />
      {/* Discussion card */}
      <div
        className={`flex flex-col bg-white md:p-[50px] p-9 rounded-[25px] shadow-accordion gap-5`}
      >
        <h1 className="text-2xl font-semibold text-textdark">
          {activeDiscussionItem?.title}
        </h1>

        <div className="w-full flex">
          <Image
            src={activeDiscussionItem?.userImage || profile}
            alt="general_discussion"
            fill
            className="!relative md:max-h-[58px] md:max-w-[58px] max-h-9 max-w-9 rounded-full"
          />

          <div className="flex md:flex-row flex-col gap-6 justify-between md:items-center flex-grow">
            <div className="ml-5 flex-1 font-roboto">
              <h2 className="text-lg font-semibold text-textdark">
                {activeDiscussionItem?.name}
              </h2>

              <p className="text-textdark text-xs mt-1">
                {activeDiscussionItem?.timeAgo}
              </p>
            </div>

            <div className="flex sm:flex-row flex-col text-nowrap sm:items-center items-end gap-4 self-end md:self-center">
              {activeDiscussionItem?.labels.map((label, index) => (
                <div
                  key={index}
                  className="py-2 px-4 rounded-[8px] bg-[#8d1b3d1a] text-[#8D1B3D] text-xs font-semibold font-montserrat"
                >
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className="editor_response"
          dangerouslySetInnerHTML={{
            __html: activeDiscussionItem?.descriptions || "",
          }}
        />

        <>
          {/* <p className="text-textlight font-roboto !font-normal mt-2.5 text-sm tracking-wider">
                  School administration is a critical role that directly impacts the
                  success of both students and staff. This discussion focuses on
                  sharing strategies, experiences, and innovative practices that
                  help school administrators excel in their responsibilities. From
                  budget planning to fostering a positive school culture, join this
                  conversation to exchange insights and solve challenges faced in
                  modern education management.
                </p>
    
                <h3 className="text-lg font-semibold text-textdark">
                  Key Discussion Points:
                </h3>
    
                <ol className="list-decimal w-full ml-4 text-[#696969] font-roboto md:text-sm text-xs tracking-[0.42px] space-y-4">
                  <li className="space-y-1">
                    <p className="font-semibold">Budget Management:</p>
                    <ul className="list-disc w-full ml-4 space-y-1">
                      <li>
                        How do you prioritize spending on academics, extracurricular
                        activities, and facilities?
                      </li>
                      <li>
                        Tips for optimizing budgets and reducing unnecessary
                        expenses.
                      </li>
                      <li>
                        Sharing effective financial management tools or software for
                        schools.
                      </li>
                    </ul>
                  </li>
                  <li className="space-y-1">
                    <p className="font-semibold">
                      Teacher Recruitment and Retention:
                    </p>
                    <ul className="list-disc w-full ml-4 space-y-1">
                      <li>
                        Strategies for hiring passionate and qualified educators.
                      </li>
                      <li>
                        Ways to retain teachers and boost morale, including
                        professional development opportunities.
                      </li>
                      <li>
                        What support systems can schools create to prevent teacher
                        burnout?
                      </li>
                    </ul>
                  </li>
                </ol> */}
        </>
      </div>

      {/* Comment title */}
      <h2 className="py-10 w-full text-[#696969] text-center font-medium font-roboto tracking-[0.9px]">
        Comments
      </h2>

      {/* comments */}
      <div
        className={`flex flex-col bg-white md:p-[30px] p-4 rounded-[25px] shadow-accordion gap-8`}
      >
        {/* Add comments */}
        <div className="flex sm:flex-row flex-col gap-4 sm:items-center justify-between w-full sm:h-[71px] p-6 rounded-[20px] bg-[#F2F2F2] border border-[#E4E4E4]">
          <input
            type="text"
            className="bg-transparent border-none focus:outline-none"
            placeholder="Type your comment here..."
          />

          <PrimaryButton
            text="Add comment"
            className="!px-10 lg:!py-3 lg:!text-sm !text-xs shadow-button !rounded-2xl"
          />
        </div>

        {activeDiscussionItem?.discussion_comments?.map((item) => (
          <React.Fragment key={item.id}>
            <Comments item={item} />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default DiscussionCard;
