"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { SunIcon, MoonIcon, DesktopIcon } from "@radix-ui/react-icons";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  //we can avoid hydration error
  useEffect(() => setMounted(true), []);

  const handleThemeChange = (value: string) => {
    setTheme(value);
  };

  if (!mounted) return null;

  return (
    <Tabs defaultValue={theme}>
      <TabsList>
        <TabsTrigger value="light" onClick={() => handleThemeChange("light")}>
          <SunIcon className="size-[1.2rem] rotate-0 dark:rotate-180 transition-all duration-300" />
        </TabsTrigger>
        <TabsTrigger value="dark" onClick={() => handleThemeChange("dark")}>
          <MoonIcon className="size-[1.2rem] rotate-90 dark:rotate-0 transition-all duration-300" />
        </TabsTrigger>
        <TabsTrigger value="system" onClick={() => handleThemeChange("system")}>
          <DesktopIcon className="size-[1.2rem]" />
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default ThemeSwitcher;
