"use client";

import React from "react";
import { IconType } from "react-icons/lib";

interface ButtonProps {
  text: string;
  icon?: HTMLAllCollection | IconType | any;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  iconPosition?: "prefix" | "postfix";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  isLoading?: boolean;
}

const PrimaryButton: React.FC<ButtonProps> = ({
  text,
  icon,
  onClick,
  iconPosition = "prefix",
  type = "button",
  disabled = false,
  className = "",
  isLoading = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`bg-primary hover:bg-[#1d7246] ${
        iconPosition === "prefix" ? "flex-row" : "flex-row-reverse"
      } transition-all duration-300 2xl:py-4 lg:py-3 py-2 2xl:px-12 lg:px-10 px-8 rounded-[20px] text-white 2xl:text-2xl lg:text-xl md:text-lg text-sm font-roboto font-medium flex items-center justify-center gap-3 ${className}`}
    >
      {icon ? icon : null}
      {text}
    </button>
  );
};

export default PrimaryButton;
