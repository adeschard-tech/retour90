// RETOUR90 — construit l'index de recherche à partir des pages elles-mêmes.
//
// La recherche doit pouvoir trouver un dossier depuis n'importe quelle page.
// Or chaque page ne connaît que ses propres fiches. On extrait donc, une fois
// pour toutes, le titre, l'année et la rubrique de chaque fiche du site, plus
// la liste des pages, dans un petit fichier chargé partout.
//
// À lancer après toute modification des pages : node tools/build-index.mjs
import fs from 'fs';
import {EDITORIAL} from '../content/editorial.mjs';

const PAGES = {
  'index.html':  'Accueil',      'tele.html':   'Télé',      'manga.html':  'Manga',
  'musique.html':'Musique',      'cine.html':   'Ciné',      'jeux.html':   'Jeux vidéo',
  'pub.html':    'Pubs',         'sport.html':  'Sport',     'actu.html':   'Actu',
  'objets.html': 'Objets',       'food.html':   'Miam',      'arcade.html': 'Arcade',
  'club.html':   'Le Club',      'audimat.html':'Audimat'
};

const slugify = t => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const entrees = [];

// 1. les pages elles-mêmes, pour qu'une recherche « arcade » mène quelque part
for (const [f, nom] of Object.entries(PAGES)) {
  if (!fs.existsSync(f)) continue;
  const h = fs.readFileSync(f, 'utf8');
  const desc = (h.match(/<meta name="description" content="([^"]+)"/) || [, ''])[1];
  entrees.push({ k: 'page', t: nom, p: f, d: desc.slice(0, 120) });
}

// 2. toutes les fiches, avec leur page d'origine
for (const f of Object.keys(PAGES)) {
  if (!fs.existsSync(f)) continue;
  const h = fs.readFileSync(f, 'utf8');
  const re = /<article class="fiche"[^>]*>\s*<div class="yr">([^<]*)<\/div><h4 class="h">([^<]*)<\/h4>\s*<div class="d">([\s\S]*?)<\/div><div class="tag">([^<]*)<\/div>/g;
  let m;
  while ((m = re.exec(h))) {
    entrees.push({
      k: 'doc', t: m[2].trim(), p: f, y: m[1].trim(), g: m[4].trim(),
      s: slugify(m[2].trim()),
      d: m[3].replace(/\s+/g, ' ').trim().slice(0, 150)
    });
  }
}


const catalogue=fs.existsSync('content/catalogue.json')?JSON.parse(fs.readFileSync('content/catalogue.json','utf8')):[];
for(const item of catalogue){let e=entrees.find(x=>x.s===item.slug);const extra=EDITORIAL[item.slug];if(!e){e={k:'doc',s:item.slug,t:item.title,p:item.category+'.html',d:extra?.d||'',y:extra?.y||'Années 90',g:item.category};entrees.push(e)}e.u=item.url;if(extra?.d)e.d=extra.d;}
for(const [p,t] of [['dossiers.html','Tous les dossiers'],['collections.html','Collections'],['reseaux.html','Nos réseaux'],['souvenirs.html','Ma boîte à souvenirs'],['a-propos.html','À propos']])entrees.push({k:'page',p,t});

const sortie = '/* RETOUR90 - index de recherche, genere par tools/build-index.mjs */\n' +
  'window.RECHERCHE=' + JSON.stringify(entrees) + ';\n';
fs.writeFileSync('assets/recherche.js', sortie, 'utf8');

const pages = entrees.filter(e => e.k === 'page').length;
console.log('index écrit : ' + pages + ' pages, ' + (entrees.length - pages) + ' fiches');
console.log('taille : ' + Math.round(sortie.length / 1024) + ' Ko');
