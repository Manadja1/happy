"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Bot,
  Menu,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileBottomNav() {
  const pathname = usePathname();

  const handleOpenDrawer = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-dashboard-drawer"));
    }
  };

  const navLeft = [
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
  ];

  const navRight = [
    {
      label: "Happy AI",
      href: "/dashboard/ai",
      icon: <Bot className="h-5 w-5" />,
      highlight: true,
    },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-happy-ink-100 bg-white/95 backdrop-blur-md px-2 py-1.5 shadow-card">
      <div className="flex items-center justify-around">
        {/* Left two items: Accueil, Invités */}
        {navLeft.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center py-1 px-2.5 min-h-[48px] rounded-xl transition-colors",
                isActive
                  ? "text-happy-coral-600 font-bold"
                  : "text-happy-ink-500 hover:text-happy-ink-800"
              )}
            >
              {item.icon}
              <span className="text-[10px] mt-1 font-medium">{item.label}</span>
            </Link>
          );
        })}

        {/* Central Action Button: Nouvel Événement */}
        <div className="relative -top-4">
          <Link
            href="/dashboard/events/new"
            className="flex h-13 w-13 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-happy-coral-500 via-happy-coral-600 to-amber-500 text-white shadow-glow active:scale-95 transition-transform"
            aria-label="Nouvel événement"
          >
            <Plus className="h-6 w-6 stroke-[2.5]" />
          </Link>
        </div>

        {/* Right item 1: Happy AI (1-tap directly to AI assistant & drinks calculator) */}
        {navRight.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center py-1 px-2.5 min-h-[48px] rounded-xl transition-colors relative",
                isActive
                  ? "text-happy-coral-600 font-bold"
                  : "text-happy-ink-500 hover:text-happy-ink-800"
              )}
            >
              <div className="relative">
                {item.icon}
                <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              </div>
              <span className="text-[10px] mt-1 font-medium">{item.label}</span>
            </Link>
          );
        })}

        {/* Right item 2: Full Menu Drawer Trigger (Opens Studio, Checkin, RSVP, Events, Settings, Profile) */}
        <button
          type="button"
          onClick={handleOpenDrawer}
          className="flex flex-col items-center justify-center py-1 px-2.5 min-h-[48px] rounded-xl text-happy-ink-500 hover:text-happy-ink-800 transition-colors"
          aria-label="Menu complet"
        >
          <Menu className="h-5 w-5" />
          <span className="text-[10px] mt-1 font-medium">Menu</span>
        </button>
      </div>
    </nav>
  );
}
