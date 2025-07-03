# ZVS System (Zact Video Streaming System)

## Présentation

ZVS System est une application de streaming vidéo basée sur Next.js, permettant de lire des vidéos en HLS (HTTP Live Streaming) avec une interface moderne et réactive. Le projet propose un lecteur vidéo avancé, une gestion dynamique des vidéos et un système de proxy pour sécuriser et optimiser la diffusion des flux HLS.

> **Note :** L’intégration complète des sous-titres est en cours de développement.

---

## Fonctionnalités principales

- **Lecture de vidéos HLS** : Support natif HLS.js pour une compatibilité maximale.
- **Liste dynamique de vidéos** : Récupération automatique des vidéos disponibles via une API.
- **Proxy sécurisé** : Les flux HLS et les sous-titres passent par un proxy Next.js pour plus de sécurité.
- **Interface utilisateur moderne** : Composants réutilisables (boutons, sliders, dropdowns, etc.).
- **Thème adaptatif** : Support du mode sombre/clair via `next-themes`.
- **Gestion des erreurs et du chargement** : Feedback utilisateur en cas de problème réseau ou de format.

---

## Architecture

```
src/
├── app/
│   ├── api/                # Endpoints API Next.js (proxy HLS, vidéos)
│   │   ├── hls/[...path]/  # Proxy dynamique pour les flux HLS
│   │   └── videos/         # Endpoint pour la liste et le détail des vidéos
│   ├── layout.tsx          # Layout global, gestion du thème
│   ├── page.tsx            # Page principale, affichage du lecteur et de la liste
│   └── api.ts              # Types et mock API (pour développement)
├── components/
│   ├── theme-provider.tsx  # Gestion du thème (sombre/clair)
│   └── ui/                 # Composants UI réutilisables (player, boutons, etc.)
└── lib/                    # Fonctions utilitaires
```

---

## Fonctionnement

### 1. Récupération des vidéos

- Au chargement, l’application interroge `/api/videos` pour obtenir la liste des vidéos disponibles (titre, URL HLS, image de prévisualisation, etc.).
- L’API Next.js fait office de proxy vers un backend (par défaut sur `localhost:5000`).

### 2. Lecture vidéo

- Lorsqu’une vidéo est sélectionnée, le lecteur utilise HLS.js pour lire le flux.
- Les URLs HLS sont automatiquement proxifiées via `/api/hls/` pour sécuriser l’accès.

### 3. Sous-titres

- Le lecteur supporte l’ajout de pistes de sous-titres (VTT).
- **⚠️ L’intégration complète des sous-titres est en cours de développement.**

### 4. Interface utilisateur

- Le lecteur propose toutes les fonctionnalités modernes : play/pause, seek, volume, plein écran, sélection de sous-titres (à venir), etc.
- Les composants UI sont personnalisés et réutilisables.

---

## Configuration

### Prérequis

- Node.js 18+
- Un backend HLS (par défaut attendu sur `localhost:5000`)

### Installation

```bash
npm install
```

### Lancement en développement

```bash
npm run dev
```

L’application sera disponible sur [http://localhost:3000](http://localhost:3000).

---

## Personnalisation

- **Backend HLS** : Modifiez les URLs dans `next.config.ts` si votre backend n’est pas sur `localhost:5000`.
- **Thème** : Le thème s’adapte automatiquement au système, mais peut être personnalisé.
- **Composants UI** : Les composants du dossier `components/ui/` sont réutilisables dans d’autres projets Next.js.

---

## Limitations et évolutions

- L’intégration des sous-titres (VTT, multi-langues) est en cours d’implémentation.
