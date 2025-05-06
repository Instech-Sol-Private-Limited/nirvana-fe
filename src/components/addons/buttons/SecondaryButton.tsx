"use client";

import React from "react";
import { IconType } from "react-icons/lib";

interface ButtonProps {
  text: string;
  icon?: HTMLAllCollection | IconType | any;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
}

const SecondaryButton: React.FC<ButtonProps> = ({
  text,
  icon,
  onClick,
  type = "button",
  disabled = false,
  className = "",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`bg-secondary border border-primary xl:py-4 md:py-3 py-2 xl:px-12 md:px-10 px-8 rounded-[20px] text-primary xl:text-2xl lg:text-xl md:text-lg text-sm flex items-center justify-center gap-3 font-roboto font-medium ${className}`}
    >
      {icon ? icon : null}
      {text}
    </button>
  );
};

export default SecondaryButton;
