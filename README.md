# RETOUR90.FR

Site hommage à la culture populaire des années 90 en France. HTML, CSS et JavaScript natif, sans dépendance npm ni compilation nécessaire au déploiement. Lire `AGENTS.md` avant toute intervention.

## Lancer le site

Depuis la racine du dépôt : `node serve.cjs`, puis http://localhost:5391. La variable `PORT` permet de choisir un autre port.

## Édition de septembre 2026

- Accueil illustré et trois collections : mercredi après-midi, vidéo-club, goûter.
- 72 pages de dossiers et souvenirs, avec une URL propre, une image, un sommaire, des archives associées et des liens de découverte.
- 11 sujets enrichis de sources éditoriales explicites. Les autres reprennent le fonds existant, qui reste à approfondir et à documenter.
- 188 entrées vidéo, embarquées depuis les chaînes qui les publient. Leur disponibilité et l'autorisation d'intégration peuvent changer.
- Recherche globale, catalogue filtrable et boîte à souvenirs enregistrée sur l'appareil.
- Dix jeux dans une arcade dédiée, dont Memory 90, Réflexe néon et le quiz. Fenêtre agrandissable, pause, commandes tactiles et records personnels.
- Six cassettes de clips, neuf sélections Spotify, une carte locale et des POGS.
- Forum public, inscription et courrier utilisant les services existants. La carte, les scores et les favoris ne sont pas un compte synchronisé.
- Cinq réseaux : YouTube, Facebook, Instagram, X et LinkedIn.

## Où modifier quoi

| Fichier | Fonction |
| --- | --- |
| `assets/r90.js` | Navigation, recherche, lecteur YouTube, régie audio, baladeur, services existants |
| `assets/edition.css` | Direction graphique et adaptations mobiles |
| `assets/edition.js` | Favoris, partage, filtres, progression de lecture |
| `assets/data.js` | Catalogue des vidéos |
| `assets/docs.js` | Fonds éditorial historique |
| `assets/photos.js` | Photos et attributions historiques |
| `content/editorial.mjs` | Collections, textes enrichis, sources, sélections vidéo explicites |
| `tools/write-editorial-pages.mjs` | Écriture des pages HTML, catalogue, sitemap et llms.txt |
| `content/catalogue.json` | Inventaire généré pour le suivi éditorial |
| `assets/arcade.js` et `assets/arcade.css` | Salle, catalogue et dix jeux avec cycle de vie isolé |

Les HTML générés sont versionnés et servis tels quels. Le script éditorial est un outil d'auteur local, pas une dépendance du site hébergé. Une modification directe d'une page générée sera écrasée à la prochaine génération.

## Préparer une publication

```sh
node tools/build-index.mjs
node tools/write-editorial-pages.mjs
node tools/build-index.mjs
node tools/inject-seo.mjs
node tools/version-assets.mjs
```

Contrôler ensuite les pages et les fonctions dans le navigateur à 375 et 1280 pixels. `version-assets.mjs` est obligatoire après les changements de scripts ou de styles, y compris dans les sous-dossiers. Les corrections Safari du lecteur et la régie empêchant plusieurs sources audio de jouer ensemble doivent être préservées.

La branche `main` alimente GitHub Pages. Une refonte se vérifie sur sa branche de travail avant fusion. Après publication, refaire les contrôles sur https://retour90.fr, notamment sur un véritable iPhone.

## Contenu et provenance

Les photographies d'objets du fonds existant sont attribuées dans `photos.js`. Les décors de l'édition sont des reconstitutions générées, signalées dans l'interface. Ils ne certifient pas un modèle ou un emballage d'époque. Les marques et les dates doivent être vérifiées à partir de documents avant d'être présentées comme des repères historiques.

Les archives vidéo restent chez leurs diffuseurs. Aucun fichier vidéo d'archive n'est réhébergé. Les nouveaux dossiers disposent aussi d'un lien direct vers YouTube.

Les pages possèdent des titres, descriptions, URL canoniques et données structurées. Les dossiers enrichis indiquent leurs sources. Cela facilite la compréhension et l'indexation, sans garantir un classement Google ni une citation par un moteur de réponse. Le fichier `llms.txt` est un complément expérimental.

## Services

Le domaine retour90.fr est en ligne. Search Console et les services Supabase/Resend existants sont décrits dans `AGENTS.md`. Ce dépôt ne contient pas de secret serveur. Aucun changement de DNS, de schéma ou de permission backend n'est nécessaire pour cette édition.
