import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors select-none",
  {
    variants: {
      variant: {
        default:
          "bg-happy-coral-100 text-happy-coral-800 border border-happy-coral-200",
        confirmed:
          "bg-emerald-50 text-emerald-800 border border-emerald-200",
        pending:
          "bg-amber-50 text-amber-800 border border-amber-200",
        declined:
          "bg-rose-50 text-rose-800 border border-rose-200",
        vip:
          "bg-gradient-to-r from-amber-100 to-amber-200 text-amber-900 border border-amber-300 shadow-xs",
        whatsapp:
          "bg-emerald-100 text-emerald-900 border border-emerald-300",
        secondary:
          "bg-happy-sand-200 text-happy-ink-700 border border-happy-sand-300",
        outline:
          "border border-happy-ink-300 text-happy-ink-700 bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

export function Badge({ className, variant, dot = false, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && (
        <span
          className={cn("h-1.5 w-1.5 rounded-full", {
            "bg-happy-coral-500": variant === "default",
            "bg-emerald-500": variant === "confirmed" || variant === "whatsapp",
            "bg-amber-500": variant === "pending" || variant === "vip",
            "bg-rose-500": variant === "declined",
            "bg-happy-ink-400": variant === "secondary" || variant === "outline",
          })}
        />
      )}
      {children}
    </div>
  );
}
