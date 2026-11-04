"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Menu, X, ArrowRight, Globe, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-happy-ink-100/80 bg-white/80 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Navigation Group with Protected Spacing */}
        <div className="flex items-center gap-6 xl:gap-10 shrink-0">
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-happy-coral-500 to-amber-500 text-white shadow-soft group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="h-5 w-5 fill-white/20" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-happy-ink-900 font-display whitespace-nowrap">
                HAPPY<span className="text-happy-coral-500">EVENTS</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 -mt-1 whitespace-nowrap">
                Zéro stress
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links — Strictly single-line with whitespace-nowrap */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 text-[13px] xl:text-sm font-semibold text-happy-ink-700 shrink-0">
            <Link
              href="/#features"
              className="px-3 py-1.5 rounded-xl whitespace-nowrap text-happy-ink-800 hover:text-happy-coral-600 hover:bg-happy-sand-100/80 transition-all duration-150"
            >
              Fonctionnalités
            </Link>
            <Link
              href="/#how-it-works"
              className="px-3 py-1.5 rounded-xl whitespace-nowrap text-happy-ink-800 hover:text-happy-coral-600 hover:bg-happy-sand-100/80 transition-all duration-150"
            >
              Comment ça marche
            </Link>
            <Link
              href="/templates"
              className="px-3 py-1.5 rounded-xl whitespace-nowrap text-happy-ink-800 hover:text-happy-coral-600 hover:bg-happy-sand-100/80 transition-all duration-150"
            >
              Modèles d&apos;invitations
            </Link>
            <Link
              href="/pricing"
              className="px-3 py-1.5 rounded-xl whitespace-nowrap text-happy-ink-800 hover:text-happy-coral-600 hover:bg-happy-sand-100/80 transition-all duration-150"
            >
              Tarifs
            </Link>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("open-guided-tour"))}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap text-happy-coral-600 bg-happy-coral-50/90 hover:bg-happy-coral-100 font-bold transition-all duration-150"
            >
              <Compass className="h-3.5 w-3.5 text-happy-coral-500" />
              <span>Visite guidée</span>
            </button>
          </nav>
        </div>

        {/* Desktop CTA & Regional Badge — Balanced for all screen widths */}
        <div className="hidden md:flex items-center gap-2 xl:gap-3 shrink-0">
          <div className="hidden 2xl:flex items-center gap-1.5 px-3 py-1 rounded-full bg-happy-sand-100 text-xs font-semibold text-happy-ink-600 border border-happy-sand-200 whitespace-nowrap">
            <Globe className="h-3.5 w-3.5 text-happy-coral-500" />
            <span>Abidjan 🇨🇮</span>
          </div>

          <Link href="/login" className="shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="text-happy-ink-700 hover:text-happy-coral-600 font-semibold whitespace-nowrap"
            >
              Connexion
            </Button>
          </Link>

          <Link href="/register" className="hidden xl:inline-block shrink-0">
            <Button
              variant="secondary"
              size="sm"
              className="font-bold border border-happy-sand-300 bg-white hover:bg-happy-sand-50 text-happy-ink-900 shadow-2xs whitespace-nowrap"
            >
              Inscription
            </Button>
          </Link>

          <Link href="/dashboard/events/new" className="shrink-0">
            <Button
              variant="primary"
              size="sm"
              rightIcon={<ArrowRight className="h-4 w-4" />}
              className="shadow-soft whitespace-nowrap"
            >
              Créer mon événement
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <Link href="/dashboard/events/new">
            <Button variant="primary" size="sm" className="h-9 px-3 text-xs">
              Créer
            </Button>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-happy-sand-100 text-happy-ink-800 hover:bg-happy-sand-200 transition-colors"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-happy-ink-100 bg-white px-6 py-6 animate-fadeIn shadow-xl">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-happy-sand-200">
              <span className="text-xs font-bold uppercase text-happy-ink-400">
                Zone & Devise
              </span>
              <span className="text-xs font-bold text-happy-ink-800 flex items-center gap-1.5">
                🇨🇮 Côte d&apos;Ivoire (FCFA / XOF)
              </span>
            </div>
            <Link
              href="/#features"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-semibold text-happy-ink-800 hover:text-happy-coral-600"
            >
              Fonctionnalités
            </Link>
            <Link
              href="/#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-semibold text-happy-ink-800 hover:text-happy-coral-600"
            >
              Comment ça marche
            </Link>
            <Link
              href="/templates"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-semibold text-happy-ink-800 hover:text-happy-coral-600"
            >
              Modèles d&apos;invitations
            </Link>
            <Link
              href="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-semibold text-happy-ink-800 hover:text-happy-coral-600"
            >
              Tarifs
            </Link>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                window.dispatchEvent(new CustomEvent("open-guided-tour"));
              }}
              className="flex items-center gap-2 text-base font-bold text-happy-coral-600 text-left"
            >
              <Compass className="h-4 w-4 text-happy-coral-500" />
              <span>Lancer la visite guidée interactive</span>
            </button>
            <div className="pt-4 flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="secondary" className="w-full text-xs font-bold">
                    Connexion
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full text-xs font-bold border-happy-sand-300 bg-white">
                    Inscription
                  </Button>
                </Link>
              </div>
              <Link
                href="/dashboard/events/new"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Button variant="primary" className="w-full shadow-soft">
                  Créer mon événement
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
