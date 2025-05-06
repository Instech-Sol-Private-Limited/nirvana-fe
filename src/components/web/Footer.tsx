import React from "react";
import WrapperContainer from "@/components/addons/containers/WrapperContainer";
// import { facebook } from "../../../../public";
import Image from "next/image";
import { footer_links, footer_social_icons } from "@/constants";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="w-full h-fit relative pt-10 overflow-hidden">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="min-w-[2267px] lg:block hidden w-full absolute -bottom-[167px] left-1/2 -translate-x-1/2 z-0"
        width="2267"
        height="708"
        viewBox="0 0 1920 541"
        fill="none"
      >
        <path
          d="M-160.471 571.931C-198.935 627.298 -156.878 702.678 -89.5615 699.027L1935.39 589.193C1978.35 586.862 2012 551.342 2012 508.312V81.0001C2012 36.265 1975.74 0 1931 0H279.214C252.681 0 227.83 12.995 212.692 34.7858L-160.471 571.931Z"
          fill="url(#paint0_linear_32_2706)"
        />
        <defs>
          <linearGradient
            id="paint0_linear_32_2706"
            x1="130.879"
            y1="-145.743"
            x2="857.88"
            y2="1783.84"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#17C15B" />
            <stop offset="1" stopColor="#006C35" />
          </linearGradient>
        </defs>
      </svg>

      <WrapperContainer className="relative lg:from-transparent lg:to-transparent bg-gradient-to-tr to-[#17C15B] from-[#17C15B]">
        <div className="w-full h-full flex lg:flex-row flex-col items-center justify-between gap-10 xl:px-20 lg:px-10 md:px-6 lg:!py-40 md:!py-32 !py-20">
          <div className="lg:w-1/2 w-full flex flex-col gap-6">
            <h3 className="font-montserrat lg:text-4xl md:text-3xl text-2xl text-white font-bold">
              Gulf Schooling
            </h3>

            <p className="max-w-[393px] md:text-base text-sm text-white font-roboto leading-loose tracking-[0.64px] capitalize">
              Morbi ac sit vel nisl. Scelerisque viverra tempus tortor facilisis
              magna. Ultricies suspendisse a libero lorem sodales eget.
            </p>

            <div className="flex items-center justify-start md:gap-6 gap-4">
              {footer_social_icons.map((item) => (
                <div
                  key={item.id}
                  className="md:w-[35px] md:h-[35px] w-[27px] h-[27px] rounded-lg bg-[#EBE9E9] flex items-center justify-center"
                >
                  <Image
                    src={item.icon}
                    alt={item.alt}
                    fill
                    className="!relative md:p-2 p-1"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="lg:w-1/2 w-full flex lg:justify-end justify-between xl:gap-[120px] lg:gap-16 gap-4">
            {footer_links.map((item, index) => (
              <div key={index} className="w-fit flex flex-col gap-3">
                <h3 className="font-roboto md:text-[22px] text-lg text-white font-bold tracking-[0.88px]">
                  {item.title}
                </h3>
                <ul className="flex flex-col gap-2.5 font-roboto md:text-lg text-base text-white tracking-[0.72px]">
                  {item.items.map((e) => (
                    <li key={e.id}>
                      <Link href={e.link}>{e.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full bg-white h-0.5 " />

        <div className="w-full py-4 xl:px-20 lg:px-10 flex md:flex-row flex-col items-center justify-between gap-4">
          <span className="text-white font-roboto md:text-[17px] text-sm font-medium">
            &copy; 2024 Gulf Schooling. All rights reserved
          </span>

          <div className="flex items-center justify-center gap-[26px]">
            <Link
              href="/privacy-policy"
              className="text-white font-roboto md:text-[17px] text-sm font-medium capitalize"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms-and-conditions"
              className="text-white font-roboto md:text-[17px] text-sm font-medium"
            >
              Terms and Conditions
            </Link>
          </div>
        </div>
      </WrapperContainer>
    </div>
  );
};

export default Footer;
