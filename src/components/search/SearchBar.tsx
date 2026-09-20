"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({ onSearch, placeholder }: SearchBarProps) {
  const { t } = useLanguage();
  const [value, setValue] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => onSearch(value), 350);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(value);
      }}
      className="w-full"
    >
      <div className="group relative flex items-center gap-3 border border-border bg-background/70 px-4 py-3 backdrop-blur-md transition-colors focus-within:border-accent sm:px-5 sm:py-4">
        <svg
          className="h-5 w-5 shrink-0 text-muted transition-colors group-focus-within:text-accent"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
        <input
          type="text"
          inputMode="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder ?? t("searchPlaceholder")}
          className="w-full bg-transparent text-base text-foreground placeholder:text-muted focus:outline-none sm:text-lg"
          aria-label={t("searchAriaLabel")}
        />
        {value && (
          <button
            type="button"
            onClick={() => setValue("")}
            className="shrink-0 rounded-full p-1 text-muted transition-colors hover:bg-white/5 hover:text-foreground"
            aria-label="Suche zurücksetzen"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </form>
  );
}
