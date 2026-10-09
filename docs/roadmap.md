# Feuille de Route (Roadmap) — HAPPY EVENTS

Cette feuille de route suit strictement la progression par itérations validées :
**BUILD → TEST → FIX → REGRESSION TEST → VALIDATION → NEXT FEATURE**.

---

### [x] PHASE 0 — FOUNDATION (Sprint Actuel)
- [x] Structure de projet Next.js App Router (Modular Monolith)
- [x] Configuration TypeScript en mode strict
- [x] Design System & Tokens Tailwind (Terracotta, Or, Sable, Émeraude)
- [x] Composants UI Primitifs (Button, Card, Badge, Input, Modal, Tabs, StatCard, EmptyState, Avatar)
- [x] Layout Public (Header, Footer, Landing Page mobile-first, Showcase interactif)
- [x] Layout Dashboard (Sidebar rétractable, Header avec sélecteur d'événement, Bottom Nav mobile)
- [x] Modélisation Prisma (User, Event, Guest, Rsvp, Invitation, Checkin, Media, Task)
- [x] Documentation initiale (`/docs`)

---

### [x] PHASE 1 — AUTHENTICATION & DATABASE
- [x] Configuration Session & vérification des rôles (`lib/auth/session.ts`)
- [x] Data store persistant hybride avec seed data complet (`lib/db/store.ts`)
- [x] Modélisation Prisma PostgreSQL (`prisma/schema.prisma`)
- [x] Contrôle d'accès strict côté serveur (`assertEventAccess`)
- [x] Sécurisation des endpoints REST et validation des payloads

---

### [x] PHASE 2 — EVENTS (CRUD & CYCLES DE VIE)
- [x] Service métier `lib/events` (listing, création, mise à jour, suppression)
- [x] Générateur de slug unique et normalisé
- [x] Gestion des statuts (`DRAFT`, `PUBLISHED`, `COMPLETED`, `CANCELLED`)
- [x] Endpoints REST complets (`/api/events`, `/api/events/[id]`, `/api/events/[id]/stats`)
- [x] Formulaire interactif de création connecté en temps réel (`/dashboard/events/new`)

---

### [ ] PHASE 3 — HAPPY STUDIO (MOTEUR CRÉATIF)
- Bibliothèque de templates d'invitations numériques (Mariage, Anniversaire, Dot, etc.)
- Personnalisation visuelle (couleurs, typographies, photos, textes)
- Aperçu mobile temps réel
- Publication et génération du carton numérique

---

### [x] PHASE 4 — PUBLIC EVENT PAGE (/e/[slug])
- [x] Page événement ultra-rapide optimisée smartphone
- [x] Affichage dynamique du programme, lieu et dress code
- [x] Endpoint public dédié (`/api/public/events/[slug]`)
- [x] Bouton de partage WhatsApp natif et copie rapide de lien

---

### [x] PHASE 5 — HAPPY GUESTS
- [x] Service métier `lib/guests` (CRUD, filtrage par groupe, VIP, +1)
- [x] Importation CSV intelligente avec détection automatique des colonnes
- [x] Endpoints REST (`/api/guests`, `/api/guests/[id]`, `/api/guests/import`)
- [x] Attribution de tokens cryptographiques uniques par invité (`qrToken`)

---

### [x] PHASE 6 — RSVP & SUIVI DES RÉPONSES
- [x] Formulaire public de réponse simplifié avec gestion des accompagnants (+1) et régimes alimentaires
- [x] Endpoint de soumission RSVP (`POST /api/rsvp`)
- [x] Calcul automatique en temps réel des statistiques et taux de réponse
- [x] Génération immédiate du pass numérique individuel sécurisé

---

### [ ] PHASE 7 — DASHBOARD & ANALYTICS
- Métriques avancées (taux de conversion des invitations, délais de réponse)
- Export des listes (PDF, Excel) pour traiteurs et sécurité
- Journal d'activité de l'événement

---

### [x] PHASE 8 — QR & CHECK-IN (CONTRÔLE DES ENTRÉES)
- [x] Génération côté serveur des QR codes sécurisés avec tokens uniques
- [x] Service métier `lib/checkin` avec vérification atomique
- [x] Protection anti-doublon et alertes de fraude en temps réel
- [x] Endpoint de scan et validation (`GET /api/checkin`, `POST /api/checkin`)
- [x] Interface de scan mobile interactive avec journal des entrées en temps réel (`/dashboard/checkin`)

---

### [ ] PHASE 9 — PAYMENTS (MOBILE MONEY & CARTES)
- Architecture PaymentProvider abstraite
- Intégration Wave, Orange Money, MTN MoMo, Moov Money
- Gestion des forfaits (Découverte, Célébration, Prestige)
- Génération des factures et reçus

---

### [ ] PHASE 10 — HAPPY AI (ASSISTANT ÉVÉNEMENTIEL)
- Quick Mode : création d'événement en langage naturel
- Suggestions de thèmes, programmes et messages d'invitation WhatsApp
- Analyse prédictive des désistements
- Respect strict de la chaîne sécurisée (aucune requête SQL directe)

---

### [ ] PHASE 11 — SÉCURITÉ, TESTS & PERFORMANCE
- Audit de sécurité et tests d'intrusion (tentatives de manipulation d'`eventId` et `guestId`)
- Tests unitaires et d'intégration automatisés
- Optimisation des Core Web Vitals et performances réseaux faibles

---

### [ ] PHASE 12 — BETA PRIVÉE & DÉPLOIEMENT
- Déploiement en environnement de production cloud
- Tests utilisateurs réels avec organisateurs à Abidjan et Dakar
- Feedback loop et améliorations d'onboarding
