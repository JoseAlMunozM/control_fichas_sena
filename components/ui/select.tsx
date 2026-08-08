"use client";

import {
  forwardRef,
  useId,
  type ReactNode,
  type SelectHTMLAttributes,
} from "react";

import type { SelectOption } from "@/types";
import { cn } from "@/utils";

export interface SelectProps
  extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: ReactNode;
  error?: string;
  helperText?: ReactNode;
  options: readonly SelectOption[];
  placeholder?: string;
  containerClassName?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    {
      className,
      containerClassName,
      error,
      helperText,
      id,
      label,
      options,
      placeholder,
      ...props
    },
    ref,
  ) {
    const generatedId = useId();
    const selectId = id ?? generatedId;
    const descriptionId =
      error || helperText ? `${selectId}-description` : undefined;

    return (
      <div className={cn("w-full", containerClassName)}>
        {label ? (
          <label
            htmlFor={selectId}
            className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            {label}
          </label>
        ) : null}

        <select
          ref={ref}
          id={selectId}
          aria-describedby={descriptionId}
          aria-invalid={Boolean(error)}
          className={cn(
            "h-10 w-full rounded-lg border bg-white px-3 text-sm text-zinc-900 outline-none transition focus:ring-2 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-500 dark:bg-zinc-950 dark:text-zinc-100 dark:disabled:bg-zinc-900 dark:disabled:text-zinc-500",
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-100 dark:focus:ring-red-950"
              : "border-zinc-300 focus:border-emerald-600 focus:ring-emerald-100 dark:border-zinc-700 dark:focus:border-emerald-500 dark:focus:ring-emerald-950",
            className,
          )}
          {...props}
        >
          {placeholder ? (
            <option value="" disabled>
              {placeholder}
            </option>
          ) : null}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>

        {error || helperText ? (
          <p
            id={descriptionId}
            className={cn(
              "mt-1.5 text-xs",
              error
                ? "text-red-600 dark:text-red-400"
                : "text-zinc-500 dark:text-zinc-400",
            )}
          >
            {error ?? helperText}
          </p>
        ) : null}
      </div>
    );
  },
);
