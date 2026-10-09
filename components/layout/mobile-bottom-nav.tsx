"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  QrCode,
  Sparkles,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Accueil",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      label: "Invités",
      href: "/dashboard/guests",
      icon: <Users className="h-5 w-5" />,
    },
    {
      label: "Studio",
      href: "/dashboard/studio",
      icon: <Sparkles className="h-5 w-5" />,
    },
    {
      label: "Check-in",
      href: "/dashboard/checkin",
      icon: <QrCode className="h-5 w-5" />,
    },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-happy-ink-100 bg-white/95 backdrop-blur-md px-3 py-2 shadow-card">
      <div className="flex items-center justify-around">
        {/* First two items */}
        {navItems.slice(0, 2).map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center py-1 px-3 min-h-[48px] rounded-xl transition-colors",
                isActive
                  ? "text-happy-coral-600 font-bold"
                  : "text-happy-ink-500 hover:text-happy-ink-800"
              )}
            >
              {item.icon}
              <span className="text-[10px] mt-1">{item.label}</span>
            </Link>
          );
        })}

        {/* Central Action Button */}
        <div className="relative -top-5">
          <Link
            href="/dashboard/events/new"
            className="flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-tr from-happy-coral-500 via-happy-coral-600 to-amber-500 text-white shadow-glow active:scale-95 transition-transform"
            aria-label="Nouvel événement"
          >
            <Plus className="h-6 w-6 stroke-[2.5]" />
          </Link>
        </div>

        {/* Last two items */}
        {navItems.slice(2, 4).map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center py-1 px-3 min-h-[48px] rounded-xl transition-colors",
                isActive
                  ? "text-happy-coral-600 font-bold"
                  : "text-happy-ink-500 hover:text-happy-ink-800"
              )}
            >
              {item.icon}
              <span className="text-[10px] mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
