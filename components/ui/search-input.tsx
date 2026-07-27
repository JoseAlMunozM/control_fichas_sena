"use client";

import type { ChangeEvent } from "react";

import { Input, type InputProps } from "@/components/ui/input";

export interface SearchInputProps
  extends Omit<
    InputProps,
    "endAdornment" | "onChange" | "startAdornment" | "type" | "value"
  > {
  value: string;
  onValueChange: (value: string) => void;
}

export function SearchInput({
  onValueChange,
  placeholder = "Buscar...",
  value,
  ...props
}: SearchInputProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onValueChange(event.target.value);
  };

  return (
    <Input
      type="search"
      value={value}
      placeholder={placeholder}
      onChange={handleChange}
      startAdornment={
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="size-4"
        >
          <circle cx="11" cy="11" r="7" strokeWidth="2" />
          <path d="m20 20-3.5-3.5" strokeWidth="2" strokeLinecap="round" />
        </svg>
      }
      endAdornment={
        value ? (
          <button
            type="button"
            onClick={() => onValueChange("")}
            aria-label="Limpiar búsqueda"
            className="flex size-6 items-center justify-center rounded text-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        ) : null
      }
      {...props}
    />
  );
}
