"use client";

import { useState, useEffect } from "react";

interface EmailInputProps {
  theme?: "light" | "dark";
  value?: string;
  setValue?: (val: string) => void;
}

export const EmailInput = ({
  theme = "light",
  value = "",
  setValue,
}: EmailInputProps) => {
  const [internalValue, setInternalValue] = useState(value || "");
  const isDark = theme === "dark";
  const hasValue = internalValue.trim() !== "";

  useEffect(() => {
    setInternalValue(value || "");
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInternalValue(val);
    setValue?.(val);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        id="email"
        placeholder=" "
        value={internalValue}
        onChange={handleChange}
        className={`peer w-full rounded border focus:border-2 bg-transparent px-3.5 pt-4 pb-2.5
                    placeholder-transparent focus:outline-none text-base transition-all duration-200
                    ${isDark
                      ? "border-[#5f6368] text-[#e8eaed] focus:border-[#8ab4f8]"
                      : "border-[#5f6368] text-[#202124] focus:border-[#1a73e8]"
                    }`}
      />
      <label
        htmlFor="email"
        className={`absolute left-3.5 px-1 transition-all duration-200
                    ${hasValue ? "-top-2 text-xs" : "top-3.5 text-base"}
                    peer-focus:-top-2 peer-focus:text-sm
                    ${isDark
                      ? "bg-[#0E0E0E] text-[#9aa0a6] peer-focus:text-[#8ab4f8]"
                      : "bg-white text-[#5f6368] peer-focus:text-[#1a73e8]"
                    }`}
      >
        Email atau nomor telepon
      </label>
    </div>
  );
};
