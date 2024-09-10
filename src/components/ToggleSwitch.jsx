"use client";

import React from "react";
import { useTheme } from "next-themes";
import { SunIcon, MoonIcon } from "lucide-react";

const ToggleSwitch = () => {
  const { theme, setTheme } = useTheme();

  const handleToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <button
      onClick={handleToggle}
      className="relative inline-flex items-center w-14 h-7 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-300"
    >
      <span
        className={`absolute inline-flex items-center justify-center w-6 h-6 transition-transform duration-300 ease-in-out rounded-full ${
          theme === "dark"
            ? "translate-x-7 bg-gray-900"
            : "translate-x-1 bg-white"
        }`}
      >
        {theme === "dark" ? (
          <MoonIcon className="h-4 w-4 text-white" />
        ) : (
          <SunIcon className="h-4 w-4 text-gray-900" />
        )}
      </span>
    </button>
  );
};

export default ToggleSwitch;
