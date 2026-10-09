"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, helperText, leftIcon, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold uppercase tracking-wider text-happy-ink-700"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-happy-ink-400">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            type={type}
            className={cn(
              "flex h-11 w-full rounded-xl border border-happy-ink-200 bg-white px-3.5 py-2 text-sm text-happy-ink-900 placeholder:text-happy-ink-400 transition-colors duration-150 focus:border-happy-coral-500 focus:outline-none focus:ring-2 focus:ring-happy-coral-500/20 disabled:cursor-not-allowed disabled:opacity-50",
              leftIcon && "pl-10",
              error && "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-rose-600">{error}</p>}
        {!error && helperText && (
          <p className="text-xs text-happy-ink-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, label, helperText, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold uppercase tracking-wider text-happy-ink-700"
          >
            {label}
          </label>
        )}
        <textarea
          id={inputId}
          className={cn(
            "flex min-h-[90px] w-full rounded-xl border border-happy-ink-200 bg-white px-3.5 py-2 text-sm text-happy-ink-900 placeholder:text-happy-ink-400 transition-colors duration-150 focus:border-happy-coral-500 focus:outline-none focus:ring-2 focus:ring-happy-coral-500/20 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="text-xs text-rose-600">{error}</p>}
        {!error && helperText && (
          <p className="text-xs text-happy-ink-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
