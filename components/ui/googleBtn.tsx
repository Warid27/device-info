"use client";

import clsx from "clsx";
import { ButtonHTMLAttributes } from "react";

interface GoogleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "normal" | "ghost";
  theme?: "light" | "dark";
}

export const GoogleButton = ({
  children,
  variant = "normal",
  theme = "dark",
  className,
  ...props
}: GoogleButtonProps) => {
  const isDark = theme === "dark";

  return (
    <button
      {...props}
      className={clsx(
        "py-2.5 lg:py-3 rounded-full font-medium text-sm lg:text-base transition-all duration-200 outline-none focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed",
        {
          [isDark
            ? "px-6 bg-[#8ab4f8] text-[#202124] hover:brightness-110 focus:brightness-110 active:brightness-125"
            : "px-6 bg-[#0B57D0] text-white hover:brightness-110 focus:brightness-110 active:brightness-90"]:
            variant === "normal",

          // 👻 Ghost (outlined)
          [isDark
            ? "px-4 text-[#8ab4f8] hover:bg-[#0b57d037] active:bg-[#0b57d037] hover:brightness-110 focus:brightness-110 active:brightness-125"
            : "px-4 text-[#0B57D0] hover:bg-[#0b57d037] active:bg-[#0b57d037] hover:brightness-110 focus:brightness-110"]:
            variant === "ghost",
        },
        className
      )}
    >
      {children}
    </button>
  );
};
