"use client"

import { ThemeToggle } from "./theme-toggle";

export function DesktopThemeToggle() {
  return (
    <div className="hidden md:block fixed bottom-8 right-8 z-50">
      <ThemeToggle 
        variant="outline"
        size="circle"
        className="shadow-lg bg-background/80 backdrop-blur-sm"
      />
    </div>
  );
}