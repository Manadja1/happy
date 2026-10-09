"use client";

import React, { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-happy-coral-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer",
  {
    variants: {
      variant: {
        primary:
          "bg-happy-coral-500 hover:bg-happy-coral-600 text-white shadow-sm hover:shadow-glow active:scale-[0.98]",
        gold:
          "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-sm hover:shadow-goldGlow active:scale-[0.98]",
        whatsapp:
          "bg-[#25D366] hover:bg-[#1EBE5D] text-white shadow-sm hover:shadow-md active:scale-[0.98]",
        secondary:
          "bg-white hover:bg-happy-sand-100 text-happy-ink-800 border border-happy-ink-200 shadow-sm active:scale-[0.98]",
        outline:
          "border border-happy-coral-500 text-happy-coral-600 hover:bg-happy-coral-50 active:scale-[0.98]",
        ghost:
          "hover:bg-happy-sand-200/60 text-happy-ink-700 active:scale-[0.98]",
        link:
          "text-happy-coral-600 underline-offset-4 hover:underline p-0 h-auto font-medium",
      },
      size: {
        sm: "h-9 px-3.5 text-xs rounded-lg gap-1.5",
        md: "h-11 px-5 text-sm rounded-xl gap-2",
        lg: "h-13 px-7 text-base rounded-2xl gap-2.5 font-semibold",
        icon: "h-11 w-11 rounded-xl p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin text-current" />
        ) : (
          leftIcon
        )}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
