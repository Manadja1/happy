"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  MessageCircle,
  Mail,
  Lock,
  Phone,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function LoginPage() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<"whatsapp" | "email">("whatsapp");
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Form states
  const [phoneCountry, setPhoneCountry] = useState("+225");
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate instant login experience
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMsg("Connexion réussie ! Redirection vers votre tableau de bord...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 700);
    }, 900);
  };

  return (
    <div className="flex min-h-[calc(100vh-140px)] flex-col justify-center px-4 py-12 sm:px-6 lg:px-8 bg-gradient-to-b from-happy-sand-100 via-[#FAF8F5] to-white relative overflow-hidden">
      {/* Glow backgrounds */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[500px] rounded-full bg-gradient-to-tr from-happy-coral-200/30 via-amber-200/20 to-transparent blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        {/* Brand Icon */}
        <Link href="/" className="inline-flex items-center gap-2.5 mb-6 group">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-happy-coral-500 to-amber-500 text-white shadow-soft group-hover:scale-105 transition-transform duration-200">
            <Sparkles className="h-6 w-6 fill-white/20" />
          </div>
        </Link>

        <h2 className="text-3xl font-extrabold text-happy-ink-950 font-display tracking-tight">
          {isRegister ? "Créer un compte" : "Bienvenue sur HAPPY EVENTS"}
        </h2>
        <p className="mt-2 text-sm text-happy-ink-600">
          {isRegister
            ? "Organisez votre premier événement en toute sérénité."
            : "Accédez à vos événements, listes d'invités et cartons d'invitation."}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="rounded-3xl border border-happy-ink-200/90 bg-white p-6 sm:p-8 shadow-card backdrop-blur-md">
          {/* Method Tabs: WhatsApp vs Email */}
          <div className="flex rounded-2xl bg-happy-sand-100 p-1 mb-6">
            <button
              type="button"
              onClick={() => setAuthMode("whatsapp")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl transition-all ${
                authMode === "whatsapp"
                  ? "bg-white text-emerald-800 shadow-xs"
                  : "text-happy-ink-600 hover:text-happy-ink-900"
              }`}
            >
              <MessageCircle className="h-4 w-4 text-emerald-600" />
              <span>WhatsApp / SMS</span>
            </button>
            <button
              type="button"
              onClick={() => setAuthMode("email")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl transition-all ${
                authMode === "email"
                  ? "bg-white text-happy-ink-900 shadow-xs"
                  : "text-happy-ink-600 hover:text-happy-ink-900"
              }`}
            >
              <Mail className="h-4 w-4 text-happy-coral-500" />
              <span>Email</span>
            </button>
          </div>

          {successMsg && (
            <div className="mb-5 rounded-2xl bg-emerald-50 border border-emerald-200 p-3.5 flex items-center gap-2.5 text-xs font-bold text-emerald-800 animate-fadeIn">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <Input
                label="Nom complet ou Titre"
                placeholder="Ex: Ange & Marc Konan"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            )}

            {authMode === "whatsapp" ? (
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-happy-ink-700">
                  Numéro de téléphone WhatsApp
                </label>
                <div className="flex gap-2">
                  <select
                    value={phoneCountry}
                    onChange={(e) => setPhoneCountry(e.target.value)}
                    className="h-11 rounded-xl border border-happy-ink-200 bg-happy-sand-50 px-3 text-xs font-bold text-happy-ink-800 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="+225">🇨🇮 +225</option>
                    <option value="+221">🇸🇳 +221</option>
                    <option value="+229">🇧🇯 +229</option>
                    <option value="+228">🇹🇬 +228</option>
                    <option value="+237">🇨🇲 +237</option>
                    <option value="+33">🇫🇷 +33</option>
                    <option value="+1">🇺🇸 +1</option>
                  </select>
                  <input
                    type="tel"
                    placeholder="07 00 00 00 00"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="flex-1 h-11 rounded-xl border border-happy-ink-200 bg-white px-3.5 text-sm text-happy-ink-900 placeholder:text-happy-ink-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-happy-ink-400">
                  Un code sécurisé instantané vous sera envoyé sur WhatsApp ou par SMS.
                </p>
              </div>
            ) : (
              <>
                <Input
                  label="Adresse Email"
                  type="email"
                  placeholder="contact@exemple.ci"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leftIcon={<Mail className="h-4 w-4" />}
                  required
                />

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-happy-ink-700">
                      Mot de passe
                    </label>
                    {!isRegister && (
                      <button
                        type="button"
                        onClick={() => alert("Lien de réinitialisation envoyé à votre adresse email.")}
                        className="text-xs text-happy-coral-600 hover:underline font-medium"
                      >
                        Mot de passe oublié ?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-11 w-full rounded-xl border border-happy-ink-200 bg-white pl-3.5 pr-10 text-sm text-happy-ink-900 placeholder:text-happy-ink-400 focus:border-happy-coral-500 focus:ring-2 focus:ring-happy-coral-500/20 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-happy-ink-400 hover:text-happy-ink-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </>
            )}

            <Button
              type="submit"
              variant={authMode === "whatsapp" ? "whatsapp" : "primary"}
              className="w-full h-12 text-sm mt-2 shadow-soft font-bold"
              disabled={isLoading}
              rightIcon={!isLoading ? <ArrowRight className="h-4 w-4" /> : undefined}
            >
              {isLoading
                ? "Connexion en cours..."
                : isRegister
                ? "Créer mon compte organisateur"
                : authMode === "whatsapp"
                ? "Recevoir mon code WhatsApp"
                : "Se connecter"}
            </Button>
          </form>

          {/* Divider */}
          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-happy-ink-100" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-happy-ink-400 font-semibold">
                Ou continuer avec
              </span>
            </div>
          </div>

          {/* Social button: Google */}
          <div className="mt-4">
            <button
              type="button"
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => {
                  router.push("/dashboard");
                }, 700);
              }}
              className="w-full h-11 rounded-xl border border-happy-ink-200 bg-white px-4 flex items-center justify-center gap-3 text-xs font-bold text-happy-ink-800 hover:bg-happy-sand-50 transition-colors shadow-xs"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continuer avec Google</span>
            </button>
          </div>

          {/* Toggle Register / Login */}
          <div className="mt-6 text-center text-xs text-happy-ink-600">
            {isRegister ? (
              <span>
                Vous avez déjà un compte ?{" "}
                <button
                  type="button"
                  onClick={() => setIsRegister(false)}
                  className="font-bold text-happy-coral-600 hover:underline"
                >
                  Se connecter
                </button>
              </span>
            ) : (
              <span>
                Pas encore de compte ?{" "}
                <button
                  type="button"
                  onClick={() => setIsRegister(true)}
                  className="font-bold text-happy-coral-600 hover:underline"
                >
                  Créer un événement gratuitement
                </button>
              </span>
            )}
          </div>
        </div>

        {/* Security & trust notice */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-happy-ink-500 text-center">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>Données chiffrées & conformes aux normes de confidentialité</span>
        </div>
      </div>
    </div>
  );
}
