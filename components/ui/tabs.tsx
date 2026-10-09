"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div
      className={cn(
        "flex space-x-1 overflow-x-auto rounded-2xl bg-happy-sand-200/80 p-1.5 scrollbar-none",
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2 text-xs md:text-sm font-semibold transition-all duration-200 cursor-pointer select-none",
              isActive
                ? "bg-white text-happy-ink-900 shadow-soft"
                : "text-happy-ink-600 hover:text-happy-ink-900 hover:bg-white/50"
            )}
          >
            {tab.icon && <span className="h-4 w-4">{tab.icon}</span>}
            <span>{tab.label}</span>
            {typeof tab.count === "number" && (
              <span
                className={cn(
                  "ml-1 rounded-full px-2 py-0.5 text-xs font-bold",
                  isActive
                    ? "bg-happy-coral-100 text-happy-coral-700"
                    : "bg-happy-sand-300 text-happy-ink-600"
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
