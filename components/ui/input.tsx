"use client";

interface EmailInputProps {
  theme?: "light" | "dark";
}

export const EmailInput = ({ theme = "light" }: EmailInputProps) => {
  const isDark = theme === "dark";

  return (
    <div className="relative w-full">
      <input
        type="text"
        id="email"
        placeholder=" "
        className={`peer w-full rounded border focus:border-2 bg-transparent px-3.5 pt-4 pb-2.5 
                    placeholder-transparent focus:outline-none text-base transition-all duration-200
                    ${isDark 
                      ? "border-[#5f6368] text-[#e8eaed] focus:border-[#8ab4f8]"
                      : "border-[#dadce0] text-[#202124] focus:border-[#1a73e8]"
                    }`}
      />
      <label
        htmlFor="email"
        className={`absolute left-3.5 top-2.5 px-1 transition-all duration-200
                    peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base
                    peer-focus:-top-2 peer-focus:text-sm
                    ${isDark 
                      ? "bg-[#0E0E0E] text-[#e8eaed] peer-focus:text-[#8ab4f8]" 
                      : "bg-white text-[#5f6368] peer-focus:text-[#1a73e8]"
                    }`}
      >
        Email atau nomor telepon
      </label>
    </div>
  );
};
