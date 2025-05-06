import { FC, ReactNode } from "react";
import Image from "next/image";
import React from "react";
import { bg_banner_layout, bg_banner_primary } from "../../../public";
import WrapperContainer from "../addons/containers/WrapperContainer";
import { StaticImageData } from "next/image";
import PrimaryButton from "../addons/buttons/PrimaryButton";

interface HeroBannerProps {
  title: string;
  subtitle?: string;
  desc?: ReactNode;
  btntitle?: string;
  pageImg: string | StaticImageData;
}

const HeroBanner: FC<HeroBannerProps> = ({
  title,
  subtitle,
  desc,
  btntitle,
  pageImg,
}) => {
  return (
    <div className="w-full relative lg:min-h-[744px] md:bg-banner bg-[#00732E] py-20 h-full overflow-hidden flex flex-col items-center justify-center gap-7">
      <Image
        src={bg_banner_layout}
        alt="bg_banner_layout"
        fill
        className="!w-fit !h-full !left-auto !right-0 z-0"
      />
      <Image
        src={bg_banner_primary}
        alt="bg_banner_primary"
        fill
        className="!w-fit !h-full !left-0 md:block hidden z-0"
      />

      <WrapperContainer className="w-full h-full relative lg:mt-28 mt-8">
        <div className="w-full h-full flex md:flex-row flex-col items-center justify-between md:gap-10 gap-20">
          <div className="md:w-1/2 w-full flex flex-col justify-center gap-7">
            <h1 className="xl:text-6xl lg:text-5xl md:text-4xl text-3xl drop-shadow-xl text-white font-extrabold font-montserrat tracking-wider leading-normal">
              {title}
            </h1>
            {subtitle && (
              <h4 className="lg:text-2xl md:text-xl text-lg font-roboto text-white font-semibold drop-shadow-lg mt-6">
                {subtitle}
              </h4>
            )}
            {desc && (
              <p className="max-w-[882px] w-full lg:text-lg md:text-base text-sm text-white tracking-wider drop-shadow-lg font-roboto">
                {desc}
              </p>
            )}

            {btntitle && (
              <PrimaryButton
                text={btntitle}
                className="w-fit shadow-button-shadow"
              />
            )}
          </div>

          <div className="md:w-1/2 w-full h-full flex md:items-end items-center justify-center xl:self-end self-center">
            <Image
              src={pageImg}
              alt="bg_banner_primary"
              fill
              className="!relative max-h-[455px] !w-11/12"
            />
          </div>
        </div>
      </WrapperContainer>
    </div>
  );
};

export default HeroBanner;
