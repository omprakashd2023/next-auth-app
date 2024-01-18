import type { Metadata } from "next";
import { Nova_Square } from "next/font/google";

import "./globals.css";

import ThemeProvider from "@/providers/ThemeProvider";

import Navbar from "@/components/shared/Navbar";
import { Toaster } from "@/components/ui/toaster";

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

const nova_square = Nova_Square({
  weight: "400",
  display: "swap",
  style: "normal",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Auth App",
  description: "Created with Next.js",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html
      lang="en"
      className={cn(nova_square.className, "dark")}
      style={{
        colorScheme: "dark",
      }}
    >
      <body>
        <ThemeProvider>
          <div className="min-h-screen w-full flex flex-col dark:bg-neutral-950">
            <Navbar />
            <Separator className="dark:bg-violet-300/30" />
            <main className="w-full h-full dark:bg-neutral-950 flex flex-grow items-center justify-center">
              {children}
            </main>
          </div>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
};

export default RootLayout;
