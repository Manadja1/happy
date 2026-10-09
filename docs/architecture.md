# Architecture Technique — HAPPY EVENTS

## 1. Principes Fondamentaux

HAPPY EVENTS est conçu selon le paradigme **Modular Monolith** pour son MVP, évitant la complexité prématurée des microservices tout en assurant une isolation stricte des couches fonctionnelles.

```
┌─────────────────────────────────────────────────────────────┐
│                    HAPPY EVENTS (Next.js)                   │
├─────────────────────────────────────────────────────────────┤
│ Presentation Layer (App Router, Server & Client Components) │
│ - app/(public)       - app/dashboard        - app/e/[slug]  │
├─────────────────────────────────────────────────────────────┤
│ Domain & Business Services                                  │
│ - lib/events         - lib/guests           - lib/rsvp      │
│ - lib/checkin        - lib/studio           - lib/ai        │
├─────────────────────────────────────────────────────────────┤
│ Core Infrastructure & Adapters                              │
│ - lib/auth (NextAuth / JWT Session)                         │
│ - lib/db (Prisma ORM + PostgreSQL)                          │
│ - lib/notifications (WhatsApp Cloud API / SMS / Email)      │
│ - lib/qr (Server-side QR Generation & Verification)         │
│ - lib/storage (S3 / R2 Object Storage)                      │
│ - lib/payments (Mobile Money & Card Adapters)               │
└─────────────────────────────────────────────────────────────┘
```

## 2. Règle du Pivot : L'Entité EVENT

Tous les modules gravitent autour de l'entité `Event` :
- Un utilisateur possède (`owns`) plusieurs événements.
- Les invités (`guests`), formulaires (`invitations`), confirmations (`rsvps`), entrées (`checkins`), médias (`medias`) et tâches (`tasks`) sont rattachés de manière transactionnelle à un `eventId`.
- Aucune entité fille ne peut être interrogée ou modifiée sans vérifier préalablement les droits de l'utilisateur appelant sur le `eventId`.

## 3. Séparation Frontend / Backend

- **Server Components & Server Actions** : Préférés pour les opérations de mutation de données et les requêtes directes à Prisma avec vérification d'autorisation.
- **Client Components** : Restreints aux interactions de surface (formulaires dynamiques, modales, basculement d'onglets, visualisations graphiques).
- **Zéro fuite de données d'accès** : Aucune clé secrète (API keys, token DB, WhatsApp token) n'est jamais exposée dans le bundle client. Seules les variables préfixées `NEXT_PUBLIC_` sont partagées.

## 4. Stratégie Mobile-First et Réseau Faible

En Afrique de l'Ouest, l'accès se fait à 90% via smartphone, parfois sur des réseaux cellulaires 3G/4G instables :
- Tailles de bundles minimisées (aucun composant lourd superflu).
- SVG optimisés et mise en cache des polices.
- Prise en charge des interruptions réseau avec retours d'état humainement compréhensibles.
