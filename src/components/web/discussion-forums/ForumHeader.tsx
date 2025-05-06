"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notification, notification_active, user_ico } from "../../../../public";
import { usePathname, useRouter } from "next/navigation";

const ForumHeader: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const tabs = [
    {
      id: 1,
      slug: "school-management",
      title: "School Management",
    },
    {
      id: 2,
      slug: "teacher-development",
      title: "Teacher Development",
    },
    {
      id: 3,
      slug: "student-activities",
      title: "Student Activities",
    },
    {
      id: 4,
      slug: "community-discussions",
      title: "Community Discussions",
    },
  ];

  return (
    <header className="w-full min-[1690px]:flex-row flex-col fixed top-0 left-0 z-[999] bg-white overflow-hidden lg:px-12 md:px-9 px-5 pt-3 flex items-center justify-between gap-4 border-b border-[#E4E4E4]">
      <div className="w-full text-nowrap flex items-center max-[1690px]:justify-between gap-6">
        <Link
          href="/"
          className="lg:text-3xl md:text-2xl text-xl font-montserrat font-bold text-gradient lg:py-[18px] md:py-4 py-3"
        >
          Gulf Schooling
        </Link>

        <div className="w-full md:flex hidden max-w-[403px] self-end lg:h-[64px] h-[58px] py-1 px-[18px] bg-[#F2F2F2] rounded-2xl border border-[#E4E4E4] items-center justify-between">
          <input
            type="text"
            placeholder="Search..."
            className="flex-grow border-none bg-transparent focus:outline-none md:text-lg text-base text-textdark font-roboto tracking-wider font-medium"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-full"
            viewBox="0 0 45 44"
            fill="none"
          >
            <rect x="0.5" width="44" height="44" rx="10" fill="white" />
            <path
              opacity="0.5"
              d="M35.0003 34.5713L28.9339 28.505M28.9339 28.505C29.9716 27.4673 30.7947 26.2354 31.3563 24.8796C31.9179 23.5238 32.2069 22.0707 32.2069 20.6032C32.2069 19.1357 31.9179 17.6826 31.3563 16.3268C30.7947 14.971 29.9716 13.7392 28.9339 12.7015C27.8963 11.6638 26.6644 10.8407 25.3086 10.2791C23.9528 9.71751 22.4997 9.42847 21.0322 9.42847C19.5647 9.42847 18.1116 9.71751 16.7558 10.2791C15.4 10.8407 14.1681 11.6638 13.1304 12.7015C11.0348 14.7972 9.85742 17.6395 9.85742 20.6032C9.85742 23.567 11.0348 26.4093 13.1304 28.505C15.2261 30.6007 18.0685 31.778 21.0322 31.778C23.9959 31.778 26.8383 30.6007 28.9339 28.505Z"
              stroke="#343434"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* <div className="flex items-center gap-6 min-[1690px]:hidden">
          <Image
            src={notification ? notification : notification_active}
            alt="notification"
            width={32}
            height={32}
            className="cursor-pointer"
          />
          <Image
            src={user_ico}
            alt="user_ico"
            width={32}
            height={32}
            className="cursor-pointer"
          />
        </div> */}
      </div>

      <div className="w-full md:hidden flex self-end lg:h-[64px] h-12 py-1 px-[18px] bg-[#F2F2F2] rounded-2xl border border-[#E4E4E4] items-center justify-between">
        <input
          type="text"
          placeholder="Search..."
          className="flex-grow border-none bg-transparent focus:outline-none md:text-lg text-base text-textdark font-roboto tracking-wider font-medium"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 45 44"
          className="h-full"
          fill="none"
        >
          <rect x="0.5" width="44" height="44" rx="10" fill="white" />
          <path
            opacity="0.5"
            d="M35.0003 34.5713L28.9339 28.505M28.9339 28.505C29.9716 27.4673 30.7947 26.2354 31.3563 24.8796C31.9179 23.5238 32.2069 22.0707 32.2069 20.6032C32.2069 19.1357 31.9179 17.6826 31.3563 16.3268C30.7947 14.971 29.9716 13.7392 28.9339 12.7015C27.8963 11.6638 26.6644 10.8407 25.3086 10.2791C23.9528 9.71751 22.4997 9.42847 21.0322 9.42847C19.5647 9.42847 18.1116 9.71751 16.7558 10.2791C15.4 10.8407 14.1681 11.6638 13.1304 12.7015C11.0348 14.7972 9.85742 17.6395 9.85742 20.6032C9.85742 23.567 11.0348 26.4093 13.1304 28.505C15.2261 30.6007 18.0685 31.778 21.0322 31.778C23.9959 31.778 26.8383 30.6007 28.9339 28.505Z"
            stroke="#343434"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Tabs */}
      <div className="min-[1690px]:w-fit max-[1690px]:overflow-x-auto tab-scroll max-[1690px]:py-2 w-full flex space-x-6 text-nowrap px-5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => router.push(`/${tab.slug}`)}
            className={`lg:h-[102px] h-[76px] flex-grow md:text-lg text-base px-4 font-semibold font-roboto transition-colors duration-300 ${
              pathname.startsWith(`/${tab.slug}`)
                ? "border-b-2 border-primary text-primary"
                : "hover:text-primary"
            }`}
          >
            {tab.title}
          </button>
        ))}
      </div>

      {/* <div className="min-[1690px]:flex hidden items-center gap-6 pr-3">
        <Image
          src={notification ? notification : notification_active}
          alt="notification"
          width={32}
          height={32}
          className="cursor-pointer"
        />
        <Image
          src={user_ico}
          alt="user_ico"
          width={32}
          height={32}
          className="cursor-pointer"
        />
      </div> */}
    </header>
  );
};

export default ForumHeader;
