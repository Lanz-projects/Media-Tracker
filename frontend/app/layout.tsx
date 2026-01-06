import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { Lora } from "next/font/google";
import "./globals.css";

import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileDock } from "@/components/layout/mobile-dock";
import { DesktopThemeToggle } from "@/components/layout/desktop-theme-toggle";

const fontSans = GeistSans;

const fontSerif = Lora({
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Dynamic Reading Tracker",
  description: "A sleek, professional, and minimalist reading tracker.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased bg-grain",
          fontSans.variable,
          fontSerif.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen w-full">
            <Sidebar />
            <main className="flex-grow pb-16 md:pb-0">
              {children}
            </main>
            <MobileDock />
            <DesktopThemeToggle />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}