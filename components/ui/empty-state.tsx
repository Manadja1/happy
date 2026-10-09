import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-3xl border border-dashed border-happy-ink-200 bg-white/60 p-8 md:p-12 text-center",
        className
      )}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-happy-coral-50 text-happy-coral-600 shadow-xs mb-4">
        {icon}
      </div>
      <h3 className="text-lg md:text-xl font-bold text-happy-ink-900 font-display">
        {title}
      </h3>
      <p className="mt-1.5 max-w-md text-sm text-happy-ink-500 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <div className="mt-6">
          <Button variant="primary" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
