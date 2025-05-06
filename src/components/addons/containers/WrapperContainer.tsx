import React from "react";

const WrapperContainer = ({
  children,
  className,
  innerClassName,
}: Readonly<{
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
}>) => {
  return (
    <div className={`w-full flex flex-col items-center ${className}`}>
      <div className={`max-w-[1724px] w-full lg:px-10 md:px-7 px-5 ${innerClassName}`}>{children}</div>
    </div>
  );
};

export default WrapperContainer;
