# Atlas Pokédex

Une web app Pokémon moderne, rapide et visuellement premium, pensée comme une encyclopédie claire plutôt qu’un wiki brut.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- PokéAPI
- Local storage pour les favoris

## Ce que contient le projet

- Accueil premium avec recherche immédiate
- Pokédex filtrable par nom, numéro, type et génération
- Page détail Pokémon inspirée de la maquette fournie
- Carrousel supérieur avec `selectedPokemon` séparé du `carouselIndex`
- Sidebar sticky sur desktop
- Background adaptatif selon le type principal
- Favoris en local storage
- États `loading`, `error`, `empty`
- Métadonnées, `robots` et `sitemap`

## Structure

```text
app/
  api/pokemon/...
  favorites/
  pokedex/
  pokemon/[slug]/
components/
  layout/
  pokemon/
  providers/
  ui/
lib/
  constants.ts
  pokemon-api.ts
  pokemon-theme.ts
  pokemon-type-chart.ts
  types.ts
  utils.ts
```

## Lancer le projet

Prérequis :

- Node.js 20+
- npm 10+ ou équivalent

Installation :

```bash
npm install
```

Développement :

```bash
npm run dev
```

Build de production :

```bash
npm run build
npm run start
```

## Variable utile

Pour les URLs SEO :

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Architecture produit

### Détail Pokémon

- Zone de recherche en haut
- Carrousel de voisinage avec sélection visuelle plus grande
- Hero section forte pour l’identité du Pokémon
- Bloc principal pour matchups, stats et évolution
- Colonne latérale compacte pour image, types, talents et infos clés

### Données volontairement priorisées

- identité
- image principale
- types
- taille / poids
- talents
- stats de base
- faiblesses / résistances / immunités
- évolution
- formes utiles
- sexe / capture / EV quand pertinent

## Notes techniques

- Les cartes Pokédex sont chargées par tranche via une route API locale.
- Les filtres de type s’appuient sur PokéAPI puis intersectent avec l’index global.
- Les favoris sont stockés dans `localStorage`.
- Les fetchs serveur sont revalidés quotidiennement.

## Suite logique

- ajout d’une page comparaison
- amélioration du search avec navigation clavier plus poussée
- préchargement intelligent de cartes Pokédex
- analytics produit et suivi des favoris
