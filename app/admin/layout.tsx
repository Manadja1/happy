"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ShieldAlert,
  LayoutDashboard,
  Users,
  Calendar,
  Database,
  ArrowLeft,
  Sparkles,
  LogOut,
  Activity,
  CheckCircle2,
  AlertCircle,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.status === 401) {
          router.push("/login?redirect=/admin");
          return;
        }
        if (res.status === 403) {
          setErrorMsg("Accès interdit : vous n'avez pas les droits d'administration.");
          setIsLoading(false);
          return;
        }
        const json = await res.json();
        if (json.success) {
          setCurrentUser(json.data.adminUser);
        }
      } catch (err: any) {
        setErrorMsg("Impossible de vérifier les privilèges administrateur.");
      } finally {
        setIsLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  const navItems = [
    {
      label: "Vue d'ensemble",
      href: "/admin",
      icon: LayoutDashboard,
      active: pathname === "/admin",
    },
    {
      label: "Utilisateurs & SaaS",
      href: "/admin/users",
      icon: Users,
      active: pathname.startsWith("/admin/users"),
    },
    {
      label: "Événements Globaux",
      href: "/admin/events",
      icon: Calendar,
      active: pathname.startsWith("/admin/events"),
    },
    {
      label: "Santé Supabase & DB",
      href: "/admin/system",
      icon: Database,
      active: pathname.startsWith("/admin/system"),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-happy-ink-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-happy-coral-500 border-t-transparent" />
          <p className="text-xs font-mono text-happy-ink-400">Authentification Super-Admin en cours...</p>
        </div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-happy-ink-950 p-4 text-white">
        <div className="max-w-md w-full rounded-3xl border border-red-500/30 bg-happy-ink-900/90 p-8 text-center backdrop-blur-xl">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-bold font-display">Accès Restreint</h2>
          <p className="mt-2 text-sm text-happy-ink-300">{errorMsg}</p>
          <div className="mt-6 flex flex-col gap-2">
            <Link href="/dashboard">
              <Button variant="primary" className="w-full">
                Retour à mon Espace Organisateur
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary" className="w-full">
                Se connecter avec un compte Administrateur
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070B14] text-white flex flex-col font-sans selection:bg-happy-coral-500 selection:text-white">
      {/* Super-Admin Top Command Bar */}
      <header className="sticky top-0 z-50 border-b border-happy-ink-800/80 bg-happy-ink-950/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand & Mode Indicator */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-happy-coral-500 to-amber-500 text-white shadow-soft group-hover:scale-105 transition-transform">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="font-display font-black text-lg tracking-tight">
                HAPPY<span className="text-happy-coral-500">EVENTS</span>
              </span>
            </Link>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/70 border border-red-500/40 text-[11px] font-bold text-red-400">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
              <span>SUPER-ADMIN BACK-OFFICE</span>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    item.active
                      ? "bg-happy-coral-500 text-white shadow-sm"
                      : "text-happy-ink-300 hover:text-white hover:bg-happy-ink-800"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Actions: Switch to Organizer Dashboard & Admin User */}
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="hidden sm:inline-flex">
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<ArrowLeft className="h-3.5 w-3.5" />}
                className="text-xs bg-happy-ink-800 border-happy-ink-700 text-happy-ink-200 hover:bg-happy-ink-700"
              >
                Espace Organisateur
              </Button>
            </Link>

            {/* Admin Badge */}
            <div className="flex items-center gap-2 pl-3 border-l border-happy-ink-800">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-amber-500 to-happy-coral-500 flex items-center justify-center font-bold text-xs">
                {currentUser?.name?.[0] || "A"}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-bold text-white truncate max-w-[120px]">
                  {currentUser?.name || "Admin"}
                </span>
                <span className="text-[10px] text-amber-400 font-mono">ROLE_ADMIN</span>
              </div>
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="lg:hidden p-2 rounded-xl bg-happy-ink-800 text-white"
            >
              {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileNavOpen && (
          <div className="lg:hidden border-t border-happy-ink-800 bg-happy-ink-950 px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    item.active
                      ? "bg-happy-coral-500 text-white"
                      : "text-happy-ink-300 hover:bg-happy-ink-800"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <div className="pt-2 border-t border-happy-ink-800">
              <Link
                href="/dashboard"
                onClick={() => setMobileNavOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-happy-coral-400"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Retour au Dashboard Organisateur</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>

      {/* Admin Footer */}
      <footer className="border-t border-happy-ink-900 bg-happy-ink-950 py-4 text-center text-xs text-happy-ink-500">
        <div className="flex items-center justify-center gap-4">
          <span>HAPPY EVENTS Back-Office v1.2</span>
          <span>•</span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Supabase PostgreSQL Pooler Active (eu-west-1)
          </span>
          <span>•</span>
          <span>Confidentialité SaaS Absolue</span>
        </div>
      </footer>
    </div>
  );
}
