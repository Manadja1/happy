import React from "react";
import Link from "next/link";
import { Sparkles, Heart, ShieldCheck } from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="border-t border-happy-ink-100 bg-happy-sand-100 text-happy-ink-800">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-happy-coral-500 to-amber-500 text-white shadow-soft">
                <Sparkles className="h-5 w-5 fill-white/20" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-happy-ink-900 font-display">
                  HAPPY<span className="text-happy-coral-500">EVENTS</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 -mt-1">
                  Zéro stress
                </span>
              </div>
            </Link>
            <p className="text-sm text-happy-ink-600 max-w-sm leading-relaxed">
              La plateforme intelligente pour créer, organiser, partager via WhatsApp,
              gérer vos invités et immortaliser vos célébrations depuis un seul espace.
            </p>
            <div className="flex items-center gap-2 text-xs text-happy-ink-500">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Paiements sécurisés via Mobile Money (Wave, Orange, MTN, Moov)</span>
            </div>
          </div>

          {/* Col 1: Produit */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-happy-ink-900 mb-4">
              Produit
            </h4>
            <ul className="space-y-2.5 text-sm text-happy-ink-600">
              <li>
                <Link href="/#features" className="hover:text-happy-coral-600 transition-colors">
                  HAPPY AI Assistant
                </Link>
              </li>
              <li>
                <Link href="/templates" className="hover:text-happy-coral-600 transition-colors">
                  HAPPY STUDIO Invitations
                </Link>
              </li>
              <li>
                <Link href="/#features" className="hover:text-happy-coral-600 transition-colors">
                  HAPPY GUESTS & Tables
                </Link>
              </li>
              <li>
                <Link href="/#whatsapp" className="hover:text-happy-coral-600 transition-colors">
                  Partage & Relances WhatsApp
                </Link>
              </li>
              <li>
                <Link href="/#checkin" className="hover:text-happy-coral-600 transition-colors">
                  HAPPY CHECK-IN (QR Code)
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-happy-coral-600 transition-colors">
                  Tarification & Forfaits
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Types d'événements */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-happy-ink-900 mb-4">
              Célébrations
            </h4>
            <ul className="space-y-2.5 text-sm text-happy-ink-600">
              <li>
                <Link href="/templates?type=WEDDING" className="hover:text-happy-coral-600 transition-colors">
                  Mariages & Dots traditionnelles
                </Link>
              </li>
              <li>
                <Link href="/templates?type=BIRTHDAY" className="hover:text-happy-coral-600 transition-colors">
                  Anniversaires & Jubilés
                </Link>
              </li>
              <li>
                <Link href="/templates?type=BAPTISM" className="hover:text-happy-coral-600 transition-colors">
                  Baptêmes & Communions
                </Link>
              </li>
              <li>
                <Link href="/templates?type=BABY_SHOWER" className="hover:text-happy-coral-600 transition-colors">
                  Baby Showers
                </Link>
              </li>
              <li>
                <Link href="/templates?type=CORPORATE" className="hover:text-happy-coral-600 transition-colors">
                  Événements d'entreprises
                </Link>
              </li>
              <li>
                <Link href="/templates?type=GRADUATION" className="hover:text-happy-coral-600 transition-colors">
                  Remises de diplômes
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Présence régionale */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-happy-ink-900 mb-4">
              Afrique Francophone
            </h4>
            <ul className="space-y-2.5 text-sm text-happy-ink-600">
              <li className="flex items-center gap-1.5">
                <span>🇨🇮</span> Abidjan, Côte d'Ivoire
              </li>
              <li className="flex items-center gap-1.5">
                <span>🇸🇳</span> Dakar, Sénégal
              </li>
              <li className="flex items-center gap-1.5">
                <span>🇧🇯</span> Cotonou, Bénin
              </li>
              <li className="flex items-center gap-1.5">
                <span>🇹🇬</span> Lomé, Togo
              </li>
              <li className="flex items-center gap-1.5">
                <span>🇨🇲</span> Douala / Yaoundé, Cameroun
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-happy-ink-200/60 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-happy-ink-500">
          <p>© {new Date().getFullYear()} HAPPY EVENTS. Tous droits réservés.</p>
          <div className="flex items-center gap-1">
            <span>Fait avec</span>
            <Heart className="h-3.5 w-3.5 text-happy-coral-500 fill-happy-coral-500" />
            <span>pour célébrer nos plus beaux moments.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
