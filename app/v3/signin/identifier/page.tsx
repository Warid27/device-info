"use client";

import { useState, useEffect } from "react";
import { LanguageSelect } from "@/components/ui/language-select";
import { EmailInput } from "@/components/ui/input";
import { GoogleButton } from "@/components/ui/googleBtn";
import Link from "next/link";

export default function UserView({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const continueUrl = searchParams.continue;
  const hl = searchParams.hl || "id";

  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

   useEffect(() => {
    // Check localStorage for saved theme, else detect system preference
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const initialTheme = (savedTheme === "dark" || savedTheme === "light" 
      ? savedTheme 
      : systemPrefersDark ? "dark" : "light") as "light" | "dark";

    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
    setMounted(true);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem("theme")) {
        // Only update if user hasn't set a theme
        const newTheme = e.matches ? "dark" : "light";
        setTheme(newTheme);
        document.documentElement.classList.toggle("dark", newTheme === "dark");
      }
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);
    return () =>
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-[#0E0E0E]">
        <div className="flex justify-center">
          <svg className="w-20 h-20 animate-pulse" viewBox="0 0 48 48">
            <path
              fill="#4285F4"
              d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
            />
            <path
              fill="#34A853"
              d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
            />
            <path
              fill="#FBBC05"
              d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"
            />
            <path
              fill="#EA4335"
              d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"
            />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-h-[100vh] flex bg-white dark:bg-[#1E1F20]">
      <div className="w-full">
        <div className="flex flex-col h-full  p-6 justify-between bg-white dark:bg-[#0E0E0E] rounded-none">
          {/* Desktop Layout - Side by Side */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:gap-24">
            {/* Left Side - Logo and Title */}
            <div className="lg:flex-1 lg:pt-8">
              {/* Google Logo */}
              <div className="flex justify-start mb-6 lg:mb-12">
                <svg
                  xmlns="https://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 40 48"
                  aria-hidden="true"
                >
                  <path
                    fill="#4285F4"
                    d="M39.2 24.45c0-1.55-.16-3.04-.43-4.45H20v8h10.73c-.45 2.53-1.86 4.68-4 6.11v5.05h6.5c3.78-3.48 5.97-8.62 5.97-14.71z"
                  ></path>
                  <path
                    fill="#34A853"
                    d="M20 44c5.4 0 9.92-1.79 13.24-4.84l-6.5-5.05C24.95 35.3 22.67 36 20 36c-5.19 0-9.59-3.51-11.15-8.23h-6.7v5.2C5.43 39.51 12.18 44 20 44z"
                  ></path>
                  <path
                    fill="#FABB05"
                    d="M8.85 27.77c-.4-1.19-.62-2.46-.62-3.77s.22-2.58.62-3.77v-5.2h-6.7C.78 17.73 0 20.77 0 24s.78 6.27 2.14 8.97l6.71-5.2z"
                  ></path>
                  <path
                    fill="#E94235"
                    d="M20 12c2.93 0 5.55 1.01 7.62 2.98l5.76-5.76C29.92 5.98 25.39 4 20 4 12.18 4 5.43 8.49 2.14 15.03l6.7 5.2C10.41 15.51 14.81 12 20 12z"
                  ></path>
                </svg>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-3xl lg:text-4xl font-normal text-gray-900 dark:text-[#e8eaed] mb-6">
                Login
              </h1>
              <p className="text-base lg:text-base text-gray-700 dark:text-[#e8eaed] mb-8 lg:mb-0">
                Lanjutkan ke YouTube
              </p>
            </div>

            {/* Right Side - Form */}
            <div className="lg:flex-1 lg:max-w-md">
              {/* Email Input */}
              <EmailInput theme={theme} />

              {/* Forgot email link */}
              <div className="mb-12 lg:mb-16 mt-2">
                <button className="text-sm lg:text-base font-medium text-[#0B57D0] dark:text-[#8ab4f8] hover:text-blue-500 dark:hover:text-[#aecbfa]">
                  Lupa email?
                </button>
              </div>

              {/* Helper Text */}
              <p className="text-sm mb-12 lg:mb-16 text-gray-700 dark:text-[#e8eaed] leading-relaxed">
                Bukan perangkat Anda? Gunakan jendela Penjelajahan Rahasia untuk
                login.{" "}
                <Link
                  target="_blank"
                  href="https://support.google.com/accounts/answer/2917834?visit_id=638954073962864131-3202886444&p=signin_privatebrowsing&hl=id&rd=1"
                  className="text-[#0B57D0] dark:text-[#8ab4f8] hover:text-blue-500 dark:hover:text-[#aecbfa] hover:underline active:underline focus:underline font-bold"
                >
                  Pelajari lebih lanjut cara menggunakan Mode tamu
                </Link>
              </p>

              {/* Action Buttons */}
              <div className="flex flex-row justify-between">
                <GoogleButton theme={theme} variant="ghost" className="-ms-4">
                  Buat Akun
                </GoogleButton>
                <GoogleButton theme={theme} variant="normal">
                  Selanjutnya
                </GoogleButton>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="">
            <div className="flex flex-col gap-8">
              <div className="flex items-center">
                <LanguageSelect theme={theme} />
              </div>
              <div className="flex gap-4 items-center w-full text-xs">
                <Link
                  href={
                    "https://support.google.com/accounts?hl=id&visit_id=638954101696000768-954939831&rd=2&p=account_iph"
                  }
                  target="_blank"
                  className="dark:active:bg-[#2a2a2a] active:bg-gray-200 py-1.5 px-3 rounded hover:text-gray-900 dark:hover:text-[#e8eaed]"
                >
                  Bantuan
                </Link>
                <Link
                  href={"https://policies.google.com/privacy?gl=ID&hl=id"}
                  target="_blank"
                  className="dark:active:bg-[#2a2a2a] active:bg-gray-200 py-1.5 px-3 rounded hover:text-gray-900 dark:hover:text-[#e8eaed]"
                >
                  Privasi
                </Link>
                <Link
                  href={"https://policies.google.com/terms?gl=ID&hl=id"}
                  target="_blank"
                  className="dark:active:bg-[#2a2a2a] active:bg-gray-200 py-1.5 px-3 rounded hover:text-gray-900 dark:hover:text-[#e8eaed]"
                >
                  Persyaratan
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
