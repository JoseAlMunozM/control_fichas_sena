"use client";

import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

import { cn } from "@/utils";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: ReactNode;
  error?: string;
  helperText?: ReactNode;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input(
    {
      className,
      containerClassName,
      endAdornment,
      error,
      helperText,
      id,
      label,
      startAdornment,
      ...props
    },
    ref,
  ) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const descriptionId =
      error || helperText ? `${inputId}-description` : undefined;

    return (
      <div className={cn("w-full", containerClassName)}>
        {label ? (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-medium text-zinc-700"
          >
            {label}
          </label>
        ) : null}

        <div className="relative">
          {startAdornment ? (
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
              {startAdornment}
            </span>
          ) : null}

          <input
            ref={ref}
            id={inputId}
            aria-describedby={descriptionId}
            aria-invalid={Boolean(error)}
            className={cn(
              "h-10 w-full rounded-lg border bg-white px-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:ring-2 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-500",
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                : "border-zinc-300 focus:border-emerald-600 focus:ring-emerald-100",
              startAdornment ? "pl-10" : undefined,
              endAdornment ? "pr-10" : undefined,
              className,
            )}
            {...props}
          />

          {endAdornment ? (
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400">
              {endAdornment}
            </span>
          ) : null}
        </div>

        {error || helperText ? (
          <p
            id={descriptionId}
            className={cn(
              "mt-1.5 text-xs",
              error ? "text-red-600" : "text-zinc-500",
            )}
          >
            {error ?? helperText}
          </p>
        ) : null}
      </div>
    );
  },
);
