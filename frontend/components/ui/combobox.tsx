"use client";

import * as React from "react";
import { Check, PlusCircle, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ComboboxProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyPlaceholder?: string;
  createPlaceholder?: string;
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Select a key",
  searchPlaceholder = "Search...",
  emptyPlaceholder = "No results found.",
  createPlaceholder = "Create new",
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(-1); // New state for active item
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const optionsRefs = React.useRef<HTMLDivElement[]>([]); // To manage refs for scrolling

  const formattedValue = options.find(
    (option) => option.value === value
  )?.label;

  const filteredOptions =
    searchValue === ""
      ? options
      : options.filter((option) =>
          option.label.toLowerCase().includes(searchValue.toLowerCase())
        );

  const showCreateOption =
    searchValue.trim() !== "" &&
    !options.some(
      (option) => option.label.toLowerCase() === searchValue.toLowerCase()
    );

  // Reset active index when search or open state changes
  React.useEffect(() => {
    setActiveIndex(-1);
  }, [searchValue, open]);

  // Close dropdown when clicking outside and commit typed value
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        if (open) { // Only commit if dropdown was open
          if (searchValue.trim() !== "") {
            // Commit typed value if not empty and not selected
            // Only commit if it's a new value, otherwise it means user typed something and clicked outside
            // without explicitly selecting or creating
            const exactMatch = options.find(opt => opt.label.toLowerCase() === searchValue.toLowerCase());
            if (!exactMatch) {
                onChange(searchValue.trim());
            }
          }
          setSearchValue("");
          setOpen(false);
        }
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, searchValue, onChange, options]); // Added options to dependency array

  // Focus input when opening
  React.useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  // Scroll active item into view
  React.useEffect(() => {
    if (open && activeIndex !== -1 && optionsRefs.current[activeIndex]) {
      optionsRefs.current[activeIndex].scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex, open]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setSearchValue("");
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setOpen(true); // Open dropdown on arrow down or enter if closed
        e.preventDefault();
      }
      return;
    }

    const totalOptions = filteredOptions.length + (showCreateOption ? 1 : 0);

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prevIndex) => (prevIndex + 1) % totalOptions);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(
        (prevIndex) => (prevIndex - 1 + totalOptions) % totalOptions
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex !== -1) {
        if (activeIndex < filteredOptions.length) {
          handleSelect(filteredOptions[activeIndex].value);
        } else if (showCreateOption && activeIndex === filteredOptions.length) {
          handleSelect(searchValue); // Select to create new option
        }
      } else if (searchValue.trim() !== "") {
        // If nothing is highlighted but search value exists, commit it
        onChange(searchValue.trim());
        setSearchValue("");
        setOpen(false);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setSearchValue("");
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <Button
        variant="outline"
        onClick={() => setOpen(!open)}
        className="w-full justify-between h-10 px-3 font-normal bg-transparent border border-zinc-200 dark:border-zinc-800 text-sm focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
        type="button"
      >
        <span className="truncate">
          {open
            ? searchValue || formattedValue || placeholder
            : formattedValue || placeholder}
        </span>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 rounded-md shadow-lg bg-zinc-50 dark:bg-zinc-950/95 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800">
          <div className="p-2 border-b border-b-zinc-200 dark:border-b-zinc-800">
            <input
              ref={inputRef}
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleKeyDown} // Attach keydown handler here
              className="w-full px-3 py-2 text-sm rounded-md bg-transparent border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-0 focus:border-primary placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
            />
          </div>

          <div className="max-h-[300px] overflow-y-auto p-1">
            {filteredOptions.length === 0 && !showCreateOption ? (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                {emptyPlaceholder}
              </div>
            ) : (
              <>
                {filteredOptions.map((option, index) => (
                  <div
                    key={option.value}
                    ref={(el) => (optionsRefs.current[index] = el as HTMLDivElement)} // Set ref for scrolling
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelect(option.value);
                    }}
                    className={cn(
                      "flex items-center px-3 py-2 text-sm rounded-sm cursor-pointer transition-colors",
                      value === option.value && "bg-accent text-accent-foreground",
                      activeIndex === index
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </div>
                ))}

                {showCreateOption && (
                  <div
                    ref={(el) => (optionsRefs.current[filteredOptions.length] = el as HTMLDivElement)} // Set ref for scrolling
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelect(searchValue);
                    }}
                    className={cn(
                      "flex items-center px-3 py-2 text-sm rounded-sm cursor-pointer text-emerald-600 dark:text-emerald-500 transition-colors",
                      activeIndex === filteredOptions.length
                        ? "bg-emerald-100 dark:bg-emerald-900" // Active style
                        : "hover:bg-emerald-100 dark:hover:bg-emerald-900" // Hover style
                    )}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {createPlaceholder} "{searchValue}"
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
