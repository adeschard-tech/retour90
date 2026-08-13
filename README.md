# RETOUR90.FR — le grand bol de nostalgie

Site hommage aux années 90, avec le **vrai contenu d'époque** : génériques, pubs, clips, buts, JT — lus
directement depuis les archives publiées sur YouTube (INA, chaînes officielles d'artistes, studios,
chaînes d'archives spécialisées) via le lecteur embarqué officiel `youtube-nocookie.com`.

## Lancer en local

```bash
node C:/Users/adesc/retour90/serve.cjs
```
→ http://localhost:5391 (entrée `retour90` dans `.claude/launch.json` du workspace)

## Structure

```
retour90/
├── serve.cjs               # serveur statique local (port 5391)
├── index.html              # hero mur de vignettes + zapping du jour + portails
├── tele.html               # canal 01 — génériques TV FR (17 vidéos)
├── manga.html              # canal 02 — génériques Club Do & co (16)
├── musique.html            # canal 03 — 6 K7-playlists chaînées + 52 clips par genre
├── cine.html               # canal 04 — bandes-annonces d'époque (12)
├── jeux.html               # canal 05 — pubs consoles FR + intros cultes (11)
├── pub.html                # canal 06 — spots d'époque + pages de pub intégrales (32)
├── sport.html              # canal 07 — France 98, OM 93, Pérec, Dream Team (8)
├── actu.html               # canal 08 — les 20h de l'INA (12)
├── objets.html             # canal 09 — le grenier : pubs & reportages JT des objets (27)
├── food.html               # canal 10 — le goûter (éditorial + pubs du goûter)
├── arcade.html             # canal 11 — Snake, Pong, Simon, Tamagotchi + quiz
├── club.html               # canal 12 — carte de membre, POGS, forum (localStorage)
└── assets/
    ├── r90.css             # design system « hommage VHS »
    ├── r90.js              # moteur : shell nav/footer, lecteur TV, murs, K7, recherche
    ├── arcade.js           # les 4 jeux + le quiz
    └── data.js             # 187 vidéos vérifiées (généré, voir ci-dessous)
```

## Le contenu vidéo

- **187 vidéos**, trouvées par 4 agents de recherche (télé/manga, pubs, musique, ciné/jeux/sport/actu),
  puis **chacune vérifiée** contre l'API oEmbed de YouTube (vérif oEmbed : 3 mortes écartées sur 190 candidates).
- Lues via **iframe youtube-nocookie** : la vidéo reste hébergée chez YouTube, la monétisation et les droits
  restent chez les ayants droit / chaînes qui les publient. C'est le mécanisme d'embed officiel.
- Vignettes : `i.ytimg.com` (le CDN d'images de YouTube, partie du mécanisme d'embed).
- Régénérer/re-vérifier : scripts `verify.mjs` + `gen.mjs` (dans le scratchpad de session ; à recopier
  dans `tools/` si besoin durable). À refaire tous les 2-3 mois : des vidéos meurent.

## Fonctionnalités

- **Lecteur TV par page** (poste cathodique : LED, molettes, haut-parleur) : clic sur une vignette → passe « à l'antenne »
- **Le walkman** : baladeur flottant présent sur toutes les pages, 6 K7 de vrais clips (YouTube IFrame API),
  mémorise cassette + piste + position et reprend d'un geste après chaque changement de page
- **Zapping du jour** : 12 vidéos au hasard sur l'accueil, change à chaque rechargement
- **Madeleine du jour** : 30 textes, un par jour calendaire
- **Recherche** dans les 187 vidéos
- **Arcade** : Snake, Pong, Simon, Tamagotchi persistant + quiz « Prouve que t'étais là »
- **Le Club** : pseudo/avatar, carte de membre, 24 POGS à débloquer, forum 5 fils (localStorage)
- Code Konami sur toutes les pages

## Mise en ligne (quand tu achètes retour90.fr)

Site 100 % statique → Vercel/Netlify direct (aucun build, aucun backend). Étapes :
1. Acheter retour90.fr
2. `vercel` dans le dossier (ou repo GitHub + import) — servir tel quel
3. DNS chez le registrar → Vercel
4. Étape 2 du produit : compte réel + forum persistant (Supabase) pour remplacer le localStorage

## Points d'attention

- Les embeds YouTube nécessitent d'être en ligne ; certains ayants droit désactivent la lecture
  intégrée sur certaines vidéos (elles affichent alors « Regarder sur YouTube » — le clic fonctionne).
- Prévoir un job de re-vérification oEmbed périodique pour remplacer les vidéos supprimées.
- Le forum/compte actuel est un prototype localStorage : rien n'est partagé entre visiteurs.
