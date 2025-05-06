import PrimaryButton from "@/components/addons/buttons/PrimaryButton";
import DislikeIcon from "@/components/icons/DislikeIcon";
import LikeIcon from "@/components/icons/LikeIcon";
import ReplyIcon from "@/components/icons/ReplyIcon";
import Image from "next/image";
import React from "react";

type Reply = {
  id: number;
  name: string;
  reply: string;
};

type CommentProps = {
  item: {
    usericon?: string | null;
    name: string;
    timeAgo: string;
    comment: string;
    replies: Reply[];
    likes: number;
    dislikes: number;
  };
};

const Comments: React.FC<CommentProps> = ({ item }) => {
  return (
    <div className="flex flex-col gap-5">
      <div className="h-[3px] bg-[#E4E4E4]" />

      <div className="flex">
        {item.usericon ? (
          <Image
            src={item.usericon}
            alt="general_discussion"
            fill
            className="!relative md:max-h-[58px] md:max-w-[58px] max-h-9 max-w-9 rounded-full"
          />
        ) : (
          <div className="md:h-[58px] md:w-[58px] h-9 w-9 rounded-full bg-[#D9D9D9]" />
        )}

        <div className="ml-5 flex-1 font-roboto">
          <h2 className="text-lg font-semibold text-textdark">{item.name}</h2>
          <p className="text-textdark text-xs mt-1">{item.timeAgo}</p>
        </div>
      </div>

      <p className="text-textlight text-sm tracking-wider">{item.comment}</p>

      {/* Replies */}
      {item.replies.length > 0 && (
        <div className="w-full p-5 rounded-[20px] bg-[#F9F9F9] space-y-5">
          {item.replies.map((reply) => (
            <p
              key={reply.id}
              className="text-[#696969] text-sm font-roboto tracking-[0.7px] border-b-2 border-b-[#E4E4E4] py-2"
            >
              <span className="font-medium">@{reply.name}</span>, {reply.reply}
            </p>
          ))}

          {/* Reply form */}
          <form
            name="reply"
            className="w-full flex items-center justify-between gap-3"
          >
            <input
              type="text"
              className="text-[#69696980] border-none focus:outline-none bg-transparent font-roboto text-sm font-medium tracking-[0.65px] py-1"
              placeholder="by @rahatali"
            />
            
            <button className="flex items-center gap-2 text-[#00247D] text-xs font-roboto font-light cursor-pointer">
              <ReplyIcon />
              Reply
            </button>
          </form>
        </div>
      )}

      <div className="w-full flex items-center gap-4 text-primary py-2 border-t-2 border-t-[#E4E4E4]">
        <div className="flex items-center gap-1">
          <LikeIcon />
          {item.likes}
        </div>

        <div className="flex items-center gap-1 cursor-pointer text-textlight">
          <DislikeIcon />
          {item.dislikes}
        </div>
      </div>

      {/* Type your own comment */}
      <>
        <input
          type="text"
          className="md:py-3 p-1.5 px-5 rounded-[20px] bg-[#F2F2F2] border border-[#E4E4E4] focus:outline-none"
          placeholder="Type your reply..."
        />
        <PrimaryButton
          text="Reply"
          className="!px-10 lg:!py-3 lg:!text-sm self-end !text-xs shadow-button !rounded-2xl"
        />
      </>
    </div>
  );
};

export default Comments;