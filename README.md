# Démarrage Minimal avec Nuxt 3

Consultez la [documentation de Nuxt 3](https://nuxt.com/docs/getting-started/introduction) pour en savoir plus.

## Installation

Assurez-vous d'installer les dépendances :

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Serveur de Développement

Démarrez le serveur de développement sur `http://localhost:3000` :

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Construire l'application pour la production :

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build

# bun
bun run build
```

Prévisualiser localement la version de production :

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview

# bun
bun run preview
```

Consultez la [documentation de déploiement](https://nuxt.com/docs/getting-started/deployment) pour plus d'informations.

> 📌 **Attention :** Si vous rencontrez des difficultés lors du mode hors ligne, vérifiez que la case `Bypass for Network` dans l'onglet `Applications` > `Service Worker` soit décochée

## PWA 

Les différentes fonctionnalités de PWA de ce projet sont les suivantes : 

- [x] Installation de l'application bureautique et/ou sur mobile.
- [x] Mode hors ligne.
- [x] Actualisation de la page en arrière-plan.
- [x] Mise en cache (utilisée avec le mode hors ligne).

La configuration globale de la PWA se trouve dans le fichier [nuxt.config.ts](./nuxt.config.ts) sous la clé `pwa`. En ce qui concerne le service worker (SW), ce dernier se trouve dans le fichier [sw.ts](.app/service-worker/sw.ts).
et contient les différentes stratégies de mise en cache.
