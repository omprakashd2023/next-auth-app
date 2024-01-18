"use client";

import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Paintbrush } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import ThemeSwitcher from "../theme/ThemeSwitcher";

const Navbar = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 420px)" });
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <nav className="w-full flex items-center justify-between p-4 sm:px-8 h-[60px]">
      <h1 className="text-2xl font-bold gradient-text-red-orange">AuthApp</h1>
      <div className="flex items-center gap-4">
        {isMobile ? (
          <Popover>
            <PopoverTrigger asChild>
              <Button size={"icon"} variant={"outline"}>
                <Paintbrush height={20} width={20} />
              </Button>
            </PopoverTrigger>
            <PopoverContent asChild>
              <ThemeSwitcher />
            </PopoverContent>
          </Popover>
        ) : (
          <ThemeSwitcher />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
