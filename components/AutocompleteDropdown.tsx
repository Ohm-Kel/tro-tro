"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import type { Station } from "@/lib/types";

interface AutocompleteDropdownProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (station: Station) => void;
  placeholder: string;
  icon?: React.ReactNode;
  ariaLabel: string;
}

export default function AutocompleteDropdown({
  value,
  onChange,
  onSelect,
  placeholder,
  icon,
  ariaLabel,
}: AutocompleteDropdownProps) {
  const [suggestions, setSuggestions] = useState<Station[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced station search
  useEffect(() => {
    if (!value || value.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/stations?q=${encodeURIComponent(value)}`);
        if (res.ok) {
          const data = await res.json();
          const list = data.stations || [];
          setSuggestions(list.slice(0, 8)); // Limit to 8 suggestions
          setIsOpen(list.length > 0);
          setFocusedIndex(-1);
        }
      } catch (err) {
        console.error("Autocomplete search error:", err);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(delayDebounce);
  }, [value]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (station: Station) => {
    onSelect(station);
    setIsOpen(false);
    setFocusedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (focusedIndex >= 0 && focusedIndex < suggestions.length) {
        handleSelect(suggestions[focusedIndex]);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative flex items-center">
        {icon && <div className="absolute left-3 text-slate-400 z-10">{icon}</div>}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          placeholder={placeholder}
          aria-label={ariaLabel}
          className={`w-full bg-slate-900/60 border border-white/10 hover:border-white/20 focus:border-amber-500 rounded-xl py-3 pr-12 text-white placeholder-slate-500 font-sans text-sm focus:outline-none transition-all duration-200 ${
            icon ? "pl-10" : "pl-4"
          }`}
        />
        {isLoading && (
          <div className="absolute right-12 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <ul className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 backdrop-blur-lg rounded-xl shadow-2xl border border-white/10 overflow-hidden z-50 py-1 max-h-60 overflow-y-auto">
          {suggestions.map((station, idx) => {
            const hasAlias = station.aliases && station.aliases.length > 0;
            const aliasToShow = hasAlias
              ? station.aliases.find(
                  (alias) => alias.toLowerCase() !== station.name.toLowerCase()
                )
              : null;

            return (
              <li
                key={station.id}
                onClick={() => handleSelect(station)}
                onMouseEnter={() => setFocusedIndex(idx)}
                className={`px-4 py-3 cursor-pointer text-white text-sm font-sans flex flex-col transition-colors duration-150 ${
                  focusedIndex === idx
                    ? "bg-white/10 text-amber-400"
                    : "hover:bg-white/5"
                }`}
              >
                <span className="font-semibold">{station.name}</span>
                {aliasToShow && (
                  <span className="text-xs text-slate-400 mt-0.5">
                    ({aliasToShow})
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
