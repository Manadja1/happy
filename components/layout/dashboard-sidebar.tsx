"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Sparkles,
  Users,
  CheckCircle2,
  QrCode,
  Bot,
  Settings,
  PlusCircle,
  Crown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

export function DashboardSidebar() {
  const pathname = usePathname();

  const mainNav: NavItem[] = [
    {
      label: "Vue d'ensemble",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      label: "Mes Événements",
      href: "/dashboard/events",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      label: "Happy Studio",
      href: "/dashboard/studio",
      icon: <Sparkles className="h-5 w-5" />,
    },
    {
      label: "Invités (Guests)",
      href: "/dashboard/guests",
      icon: <Users className="h-5 w-5" />,
    },
    {
      label: "Suivi RSVP",
      href: "/dashboard/rsvp",
      icon: <CheckCircle2 className="h-5 w-5" />,
    },
    {
      label: "Check-in (QR)",
      href: "/dashboard/checkin",
      icon: <QrCode className="h-5 w-5" />,
    },
    {
      label: "Happy AI",
      href: "/dashboard/ai",
      icon: <Bot className="h-5 w-5" />,
      badge: "Assistant",
    },
    {
      label: "Paramètres",
      href: "/dashboard/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-happy-ink-100 bg-white min-h-screen p-4 justify-between select-none">
      <div className="space-y-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 px-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-happy-coral-500 to-amber-500 text-white shadow-soft">
            <Sparkles className="h-5 w-5 fill-white/20" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tight text-happy-ink-900 font-display">
              HAPPY<span className="text-happy-coral-500">EVENTS</span>
            </span>
            <span className="text-[9px] font-bold uppercase tracking-wider text-amber-600 -mt-1">
              Tableau de bord
            </span>
          </div>
        </Link>

        {/* Quick New Event Button */}
        <div className="px-1">
          <Link href="/dashboard/events/new">
            <Button
              variant="primary"
              className="w-full justify-start shadow-soft"
              leftIcon={<PlusCircle className="h-4 w-4" />}
            >
              Nouvel Événement
            </Button>
          </Link>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1">
          {mainNav.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-150",
                  isActive
                    ? "bg-happy-coral-50 text-happy-coral-600 font-bold"
                    : "text-happy-ink-600 hover:bg-happy-sand-100 hover:text-happy-ink-900"
                )}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      isActive ? "text-happy-coral-600" : "text-happy-ink-400"
                    )}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Upgrade Callout */}
      <div className="rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50 to-orange-50 p-4">
        <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
          <Crown className="h-4 w-4 text-amber-600 fill-amber-500" />
          <span>HAPPY EVENTS PRO</span>
        </div>
        <p className="mt-1.5 text-xs text-amber-900/80 leading-snug">
          Débloquez WhatsApp illimité, scan multi-entrées et modèles VIP.
        </p>
        <Link href="/pricing" className="mt-3 block">
          <Button variant="gold" size="sm" className="w-full text-xs h-8">
            Découvrir l'offre
          </Button>
        </Link>
      </div>
    </aside>
  );
}
