import React from "react";
import { cn } from "@/lib/utils";

export interface AvatarProps {
  src?: string | null;
  name?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  isVip?: boolean;
}

export function Avatar({
  src,
  name,
  size = "md",
  className,
  isVip = false,
}: AvatarProps) {
  const getInitials = (n?: string | null) => {
    if (!n) return "HE";
    const parts = n.trim().split(" ");
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-xl",
  };

  return (
    <div className="relative inline-block">
      <div
        className={cn(
          "relative flex shrink-0 overflow-hidden rounded-full items-center justify-center font-bold font-display uppercase transition-transform",
          sizeClasses[size],
          src ? "bg-happy-sand-200" : "bg-gradient-to-br from-happy-coral-400 to-amber-500 text-white shadow-soft",
          isVip && "ring-2 ring-amber-400 ring-offset-2",
          className
        )}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={name || "Avatar"}
            className="h-full w-full object-cover"
          />
        ) : (
          <span>{getInitials(name)}</span>
        )}
      </div>
      {isVip && (
        <span
          className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] font-bold text-white shadow-xs"
          title="VIP"
        >
          ★
        </span>
      )}
    </div>
  );
}
