# RETOUR90.FR, brief pour un agent de code

Ce fichier est le point d'entrée pour tout assistant travaillant sur ce dépôt.
Lis-le en entier avant la première modification.

---

## 1. Ce qu'est le site

RETOUR90.FR est un site hommage aux années 90 françaises, écrit et maintenu par
Aymeric Deschard, fondateur solo. Il réunit le vrai contenu d'époque : génériques
télé, pubs, clips, buts, JT, intros de jeux. Les vidéos ne sont pas hébergées ici,
elles sont lues depuis YouTube via le lecteur embarqué officiel
`youtube-nocookie.com`, ce qui laisse droits et monétisation chez les ayants droit.

Le ton est chaleureux et complice, jamais nostalgique triste ni condescendant.
Tout le contenu visible est en français.

---

## 2. Nature technique

**Site statique, aucune étape de build, aucune dépendance npm, JavaScript vanilla.**

Ne propose jamais d'y introduire React, Vite, Tailwind, TypeScript, un bundler ou
un `package.json`. L'absence de build est un choix, pas un oubli : le dépôt est
servi tel quel par GitHub Pages, et un fichier poussé est un fichier en ligne.

- Dépôt : `github.com/adeschard-tech/retour90`, public, branche `main`
- Hébergement : GitHub Pages sur `main`, `CNAME` contient `retour90.fr`
- Local : `node serve.cjs` puis `http://localhost:5391`
- Encodage : UTF-8 sans BOM, fins de ligne CRLF

---

## 3. Arborescence

```
retour90/
├── serve.cjs              serveur statique local (port 5391)
├── CNAME robots.txt sitemap.xml llms.txt
├── index.html             accueil : mur de vignettes, zapping du jour, portails
├── tele.html              canal 01
├── manga.html             canal 02
├── musique.html           canal 03, 6 K7 chaînées + clips par genre
├── cine.html              canal 04
├── jeux.html              canal 05
├── pub.html               canal 06
├── sport.html             canal 07
├── actu.html              canal 08
├── objets.html            canal 09, le grenier
├── food.html              canal 10, le goûter
├── arcade.html            canal 11, Snake, Pong, Simon, Tamagotchi, quiz
├── club.html              canal 12, carte de membre, POGS, forum
├── audimat.html           statistiques d'audience publiques
├── test-mobile.html       page de diagnostic, noindex, hors sitemap
├── assets/
│   ├── r90.css            design system « hommage VHS »
│   ├── r90.js             moteur commun, ~1000 lignes
│   ├── data.js            187 vidéos vérifiées
│   ├── docs.js            80 dossiers rédigés, 134 Ko
│   ├── recherche.js       index de recherche, GÉNÉRÉ, ne pas éditer à la main
│   ├── photos.js          photos Wikimedia avec leur crédit
│   ├── arcade.js          les jeux et le quiz
│   ├── og.jpg             image Open Graph
│   └── img/               photos libres de droits
└── tools/
    ├── build-index.mjs    reconstruit assets/recherche.js depuis les pages
    ├── inject-seo.mjs     réécrit le bloc SEO de chaque page
    ├── version-assets.mjs appose l'empreinte de cache sur les appels d'assets
    ├── analytics.sql      schéma de mesure d'audience Supabase
    └── email-triggers.sql déclencheurs d'email Supabase
```

---

## 4. Les données

**`assets/data.js`** expose `window.R90`, un tableau de 187 objets :

```js
{cat:"tele", title:"Club Dorothée : le générique", year:"1990",
 id:"LtMN2srjDe4", channel:"Génération Club Do"}
```

`cat` vaut `tele`, `manga`, `musique`, `cine`, `jeux`, `pub`, `sport`, `actu` ou
`objets`. Chaque `id` a été vérifié contre l'API oEmbed de YouTube. Des vidéos
meurent avec le temps : une re-vérification périodique est souhaitable.

**`assets/docs.js`** expose `window.DOCS`, indexé par slug de fiche :

```js
'tamagotchi':{
  q:'tamagotchi bandai jouet',        // requête de recherche YouTube
  art:[{t:'Un titre de section', p:['un paragraphe','un autre']}],
  specs:{t:'La fiche technique', l:[['Sortie','1996'],['Prix','150 F']]},
  plus:['une anecdote','une autre']
}
```

**Les fiches** vivent dans le HTML des pages, sous cette forme exacte. Le script
`build-index.mjs` la reconnaît par expression régulière, donc ne change pas la
structure sans adapter le script :

```html
<article class="fiche" style="--c:#FF2E87"><div class="yr">1997</div><h4 class="h">Tamagotchi</h4>
  <div class="d">Une accroche de deux lignes.</div><div class="tag">Bandai</div></article>
```

Le slug d'une fiche se déduit de son titre : minuscules, accents retirés, tout
caractère non alphanumérique remplacé par un tiret.

---

## 5. Le moteur, `assets/r90.js`

Un seul fichier, chargé par toutes les pages, qui construit l'interface au
démarrage. Les pièces à connaître :

- **`shell()`** fabrique la barre du haut, l'affichage magnétoscope et le pied de
  page, et les insère dans le DOM. Toute modification de navigation, de recherche
  ou de pied de page passe par là et se répercute sur les 14 pages.
- **`RESEAUX`** est la source unique des comptes sociaux : le pied de page les
  affiche et `inject-seo.mjs` les recopie dans le `sameAs` des données
  structurées. Ajouter un réseau demande les deux fichiers.
- **`tvPlay` / `tvPause` / `tvStop`** pilotent le poste de télévision de chaque
  page via l'API IFrame de YouTube.
- **`WK`** est le walkman flottant, présent partout, qui mémorise cassette, piste
  et position dans `localStorage` et reprend après un changement de page.
- **`REGIE`** garantit qu'une seule source est à l'antenne. Deux musiques ne
  doivent jamais se superposer. Elle réagit à l'état réel de lecture rapporté par
  l'API, pas à l'intention du clic.
- **`chercher` / `renderSearch` / `ouvrirDepuisURL`** forment la recherche
  globale. Elle interroge `window.RECHERCHE` et `window.R90`, et produit des liens
  `page.html?doc=slug` ou `page.html?v=idYouTube` que `ouvrirDepuisURL` sait
  ouvrir à l'arrivée.
- **`openDoc`** affiche un dossier : article, fiche technique, anecdotes, photo
  créditée, vidéos liées, commentaires.
- **`track`** mesure l'audience sans cookie ni adresse IP, uniquement sur le
  domaine de production. Le résultat est public sur `audimat.html`.

État local du visiteur : `localStorage`, clé `retour90.v1`.

---

## 6. Rituel de publication

Après toute modification, dans cet ordre :

```bash
node tools/build-index.mjs      # seulement si des fiches ont changé
node tools/inject-seo.mjs       # seulement si des pages ont été créées ou renommées
node tools/version-assets.mjs   # TOUJOURS, sinon la correction n'atteint personne
git add -A && git commit && git push origin main
```

**`version-assets.mjs` n'est pas optionnel.** Sans empreinte de cache, Safari sur
iPhone sert l'ancien fichier pendant des heures et le correctif semble ne rien
faire. Cette erreur a déjà coûté une demi-journée de fausses pistes.

GitHub Pages met environ une minute à publier. Vérifier ensuite sur le domaine de
production, pas seulement en local.

---

## 7. Pièges éprouvés, à ne pas redécouvrir

**Encodage.** Ne fais jamais transiter un fichier UTF-8 par
`Get-Content -Raw | Set-Content` en PowerShell : l'accentuation est détruite en
double encodage. Utilise Node ou un éditeur qui préserve l'encodage.

**Safari sur iPhone.** Trois comportements ont déjà cassé le lecteur :
- une grille CSS avec `1fr` grandit jusqu'à son contenu, ce qui élargissait le
  caisson du téléviseur. Utiliser `minmax(0,1fr)`.
- `aspect-ratio` est ignoré sur un élément de grille étiré. Une cale interne en
  `padding-top:56.25%` rétablit la hauteur.
- l'API IFrame de YouTube écrit un attribut `width="640"` dans l'iframe, qui prime
  sur la largeur CSS. L'iframe est donc écrite à la main, puis l'API est
  rattachée à l'élément existant.

**Lecture automatique sur mobile.** iOS interdit le son sans geste de
l'utilisateur. Le lecteur démarre en silencieux puis rétablit le son par
plusieurs tentatives espacées. Ne « simplifie » pas ce mécanisme.

**Champs de saisie sur iOS.** Une police inférieure à 16 pixels déclenche un zoom
automatique de la page à la mise au point. Les champs sont à 16 pixels sous
`@media (hover:none)`.

---

## 8. Règles de contenu, non négociables

1. **Aucun tiret cadratin ni demi-cadratin** dans un texte destiné à être publié,
   sur le site comme sur les réseaux. Virgules, points ou deux-points.
2. **Aucune archive n'est jamais réimportée** sur une plateforme. Les génériques,
   pubs et JT appartiennent à l'INA et aux chaînes. On embarque, on lie, on ne
   réhéberge pas. Un seul manquement suffit à faire fermer un compte.
3. **Les photos sont créditées.** `photos.js` porte auteur et licence pour chaque
   image, toutes issues de Wikimedia Commons sous licence libre.
4. **Le français, toujours**, y compris dans les messages de commit et les
   commentaires de code, qui expliquent le pourquoi et non le comment.

---

## 9. Services connectés

- **Supabase**, projet `oajbjsevqefacdxkikmm` en région Paris. Tables
  `comments`, `forum_posts`, `contact_messages`, `members`, plus la mesure
  d'audience. RLS activé. La clé présente dans `r90.js` est la clé publiable,
  conçue pour être exposée : ce n'est pas une fuite.
- **Google Search Console**, propriété `https://retour90.fr`, jeton de validation
  dans `inject-seo.mjs`.
- **Resend**, domaine `retour90.fr` vérifié, pour les emails transactionnels.
- **Comptes publics** : Instagram `@retour_90`, Facebook, LinkedIn `/company/retour90/`,
  YouTube `/channel/UC15widwIHJ5M9-5A1JSxqtw`. Tous listés dans `RESEAUX`.

---

## 10. Attentes de travail

Aymeric travaille vite et ne veut pas être consulté pour chaque détail. Décide
toi même sur les choix ordinaires, signale une fois ce qui te semble discutable,
puis avance.

Vérifie ce que tu livres. Une correction d'affichage se contrôle dans un
navigateur, aux deux largeurs qui comptent, 375 pixels et 1280 pixels, et sur le
domaine de production après publication. Ne dis pas qu'une chose fonctionne sans
l'avoir vue fonctionner, et dis clairement ce que tu n'as pas pu vérifier.

## 11. Refonte éditoriale de septembre 2026

La nouvelle présentation est portée par assets/edition.css. Les interactions complémentaires sont dans assets/edition.js. Le fonds des anciens dossiers demeure dans assets/docs.js ; les textes enrichis et les collections sont dans content/editorial.mjs. Les 72 pages dossiers/*.html et les nouvelles pages éditoriales sont écrites par tools/write-editorial-pages.mjs. Ne pas les modifier directement sans reporter le changement dans leur source.

Avant publication : build-index.mjs, write-editorial-pages.mjs, build-index.mjs, inject-seo.mjs, puis version-assets.mjs. Le second passage de l'index conserve les liens des nouvelles pages. Aucune étape de génération n'est nécessaire sur GitHub Pages.

Le compte X officiel communiqué par Aymeric est https://x.com/R90_fr. Le catalogue compte désormais 188 vidéos avec l'ajout d'une bande-annonce officielle de Retour vers le futur. Les images assets/editorial/*.webp sont des ambiances générées, à signaler comme reconstituées ; elles ne prouvent pas l'identité d'un modèle. Le README décrit la structure actuelle.
