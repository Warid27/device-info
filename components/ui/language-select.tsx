"use client";

import * as React from "react";
import * as Select from "@radix-ui/react-select";
import { languages } from "./language";
import { Triangle } from "lucide-react";

interface LanguageSelectProps {
  theme?: "light" | "dark";
}

export function LanguageSelect({ theme = "dark" }: LanguageSelectProps) {
  const isDark = theme === "dark";
  const [open, setOpen] = React.useState(false);

  return (
    <Select.Root
      defaultValue="indonesia"
      open={open}
      onOpenChange={setOpen}
    >
      <Select.Trigger
        className={`cursor-pointer flex items-center justify-between w-48 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 transition-colors
          ${
            isDark
              ? "text-white active:bg-[#2a2a2a] bg-transparent hover:bg-[#2a2a2a] focus:ring-[#3ea6ff]"
              : "text-[#5f6368] active:bg-gray-200 bg-transparent hover:bg-[#f1f3f4] focus:ring-[#0B57D0]"
          }`}
        aria-label="Language"
      >
        <Select.Value />
        <Select.Icon>
          <Triangle
            className={`w-3 h-3 scale-y-50 transition-transform duration-200 ${
              open ? "" : "rotate-180"
            }`}
            fill={isDark ? "#9aa0a6" : "#5f6368"} // make it look filled
            strokeWidth={0} // removes border
          />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={6}
          align="start"
          className={`min-w-[var(--radix-select-trigger-width)] z-50 rounded-sm border shadow-[0_2px_10px_rgba(0,0,0,0.3)] overflow-hidden animate-in fade-in-0 zoom-in-95
            ${
              isDark
                ? "border-[#303134] bg-[#28292c] text-[#e8eaed]"
                : "border-[#dadce0] bg-white text-[#202124]"
            }`}
        >
          <Select.Viewport className="max-h-[80vh] w-full overflow-y-auto thin-scrollbar py-1">
            {languages.map((lang) => (
              <Select.Item
                key={lang}
                value={lang.toLowerCase()}
                className={`w-full flex items-center px-3 py-3 text-sm select-none cursor-pointer outline-none transition-colors
                  ${
                    isDark
                      ? "hover:bg-[#3a3b3e] active:bg-[#3a3b3e] focus:bg-[#3a3b3e] data-[state=checked]:bg-[#475569] data-[state=checked]:text-white"
                      : "hover:bg-[#c5c8c9] active:bg-[#c5c8c9] focus:bg-[#c5c8c9] data-[state=checked]:bg-[#d2e3fc] data-[state=checked]:text-black"
                  }`}
              >
                <Select.ItemText>{lang}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
