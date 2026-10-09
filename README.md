# HAPPY EVENTS — Votre événement. Un seul espace. Zéro stress. 🌟

Plateforme SaaS intelligente tout-en-un conçue pour créer, organiser, partager via WhatsApp, collecter les RSVP et gérer les accès par QR code lors de célébrations en Afrique francophone (Côte d'Ivoire, Sénégal, Bénin, Cameroun, etc.) et à l'international.

---

## ✨ Fonctionnalités Clés

- **📱 WhatsApp First** : Partage natif et invitations directes sur WhatsApp avec liens de confirmation personnalisés.
- **🎨 HAPPY STUDIO** : Moteur de personnalisation visuelle des cartons d'invitation avec bibliothèque de templates (Mariage Royal, Dot & Wax Chic, Anniversaire VIP, Gala & Corporate).
- **💌 Formulaire Public & RSVP en direct** : Page d'événement ultra-rapide (`/e/[slug]`), gestion des accompagnants (+1), préférences alimentaires et messages de félicitations.
- **🛡️ QR Code & HAPPY CHECK-IN** : Attribution de badges numériques sécurisés avec tokens uniques et contrôle d'accès anti-doublon en temps réel.
- **🤖 HAPPY AI Assistant** : Suggestions de programmes minute par minute, calculateur boisson & traiteur, et générateur de messages d'invitation selon le ton souhaité.
- **📊 Tableau de Bord Organisateur** : Statistiques en temps réel, filtres par groupe/VIP, export CSV des invités pour les traiteurs et équipes de sécurité.

---

## 🛠️ Stack Technique

- **Framework** : [Next.js 14](https://nextjs.org/) (App Router, Server & Client Components)
- **Langage** : [TypeScript](https://www.typescriptlang.org/) (Strict mode)
- **Styles & UI** : [Tailwind CSS](https://tailwindcss.com/) avec tokens afro-modernes personnalisés (Terracotta `#E05A47`, Or festif `#F59E0B`, Sable chaud `#FAF8F5`, Émeraude `#16A34A`) & [Lucide Icons](https://lucide.dev/)
- **ORM & Données** : [Prisma ORM](https://www.prisma.io/) avec schéma relationnel PostgreSQL & Store hybride persistant
- **Sécurité** : Contrôle d'accès strict côté serveur (`assertEventAccess`), protection contre les failles IDOR

---

## 🚀 Démarrage Rapide

### Prérequis
- [Node.js](https://nodejs.org/) (v18.17 ou supérieure)
- npm ou yarn

### Installation

1. Cloner le dépôt :
```bash
git clone https://github.com/Manadja1/happy.git
cd happy
```

2. Installer les dépendances :
```bash
npm install
```

3. Lancer le serveur de développement :
```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

### Compilation de Production

```bash
npm run build
npm run start
```

---

## 📁 Architecture du Projet

```text
happy/
├── app/
│   ├── (public)/          # Landing page, Tarifs, Modèles, Connexion
│   ├── api/               # Endpoints REST (Events, Guests, RSVP, Check-in)
│   ├── dashboard/         # Espace organisateur (Vue d'ensemble, Invités, Studio, Check-in, AI)
│   └── e/[slug]/          # Page publique de l'événement & formulaire RSVP
├── components/
│   ├── layout/            # Headers, Sidebar, Mobile Bottom Nav, Footers
│   └── ui/                # Primitives d'interface (Button, Card, Modal, Input, Badge, etc.)
├── docs/                  # Architecture, Roadmap, Schéma de base de données, Décisions (ADR)
├── lib/                   # Services métier (events, guests, rsvp, checkin, auth, db)
├── prisma/                # Modélisation Prisma (schema.prisma)
└── public/                # Assets statiques et visuels de démonstration
```

---

## 📄 Licence

Ce projet est sous licence MIT.
