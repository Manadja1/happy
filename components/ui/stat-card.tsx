import React from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

export interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-happy-ink-100 bg-white p-5 shadow-soft transition-all duration-200 hover:shadow-card",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-happy-ink-500">
          {title}
        </p>
        {icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-happy-coral-50 text-happy-coral-600">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl md:text-3xl font-bold tracking-tight text-happy-ink-900 font-display">
          {value}
        </span>
        {trend && (
          <span
            className={cn(
              "inline-flex items-center text-xs font-semibold",
              trend.isPositive ? "text-emerald-600" : "text-rose-600"
            )}
          >
            {trend.isPositive ? (
              <TrendingUp className="mr-0.5 h-3.5 w-3.5" />
            ) : (
              <TrendingDown className="mr-0.5 h-3.5 w-3.5" />
            )}
            {trend.value}%
          </span>
        )}
      </div>

      {description && (
        <p className="mt-1 text-xs text-happy-ink-400">{description}</p>
      )}
    </div>
  );
}
