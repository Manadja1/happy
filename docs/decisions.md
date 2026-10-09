# Architecture Decision Records (ADR) — HAPPY EVENTS

Ce registre consigne les décisions d'architecture majeures prises pour HAPPY EVENTS.

---

### ADR-001 : Choix du Modular Monolith plutôt que Microservices
* **Statut** : Validé
* **Contexte** : Le MVP doit être rapide à développer, simple à déployer et facile à tester par un agent ou une équipe restreinte, tout en évitant les surcoûts d'infrastructure et de synchronisation réseau.
* **Décision** : Adopter une architecture Monolithe Modulaire basée sur Next.js App Router et Prisma. Les modules (`events`, `guests`, `rsvp`, `checkin`, `studio`, `ai`) sont isolés logiquement dans `/lib` et `/components`.
* **Conséquences** : Déploiement unifié, transactions base de données fiables, évolution future possible vers des services distincts si la charge le requiert.

---

### ADR-002 : Stratégie WhatsApp First
* **Statut** : Validé
* **Contexte** : En Afrique francophone (Côte d'Ivoire, Sénégal, Bénin, Cameroun), WhatsApp est le canal de messagerie ultra-dominant. Les e-mails sont peu consultés pour les événements personnels et privés.
* **Décision** : Le parcours d'invitation, de confirmation et de rappel repose sur le partage et les liens WhatsApp en priorité absolue.
* **Conséquences** : Les pages web doivent être optimisées pour les navigateurs in-app de WhatsApp (Webview), chargement < 2s sur réseau 3G/4G.

---

### ADR-003 : Validation Stricte des Autorisations Côté Serveur (Règle #10)
* **Statut** : Validé
* **Contexte** : Risque d'usurpation et de manipulation d'ID dans les requêtes et les URLs (`/dashboard/events/[id]`).
* **Décision** : Ne jamais faire confiance aux paramètres clients ou aux champs masqués. Toute opération passe par `assertEventAccess(session.user.id, eventId)`.
* **Conséquences** : Éradication des failles de sécurité IDOR (Insecure Direct Object References).

---

### ADR-004 : Design Tokens Spécifiques et Respect du Contexte Africain Moderne
* **Statut** : Validé
* **Contexte** : Les plateformes événementielles génériques occidentales manquent de chaleur et ne correspondent pas à l'ambiance des célébrations africaines (mariages somptueux, dots traditionnelles, baptêmes).
* **Décision** : Développer une palette chromatique propre (Terracotta `#E05A47`, Or festif `#F59E0B`, Sable chaud `#FAF8F5`, Émeraude `#16A34A`) et des libellés adaptés aux réalités locales (devises en FCFA/XOF, accompagnants +1, dots, etc.).
* **Conséquences** : Forte adhésion culturelle sans tomber dans les clichés folkloriques, maintien d'une esthétique SaaS internationale de premier ordre.
