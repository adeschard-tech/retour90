// RETOUR90 — appose un numéro de version sur les fichiers appelés par les pages.
//
// Sans cela, le navigateur garde en cache l'ancien r90.js pendant dix minutes,
// et souvent bien plus longtemps sur iPhone : les corrections déployées ne
// parviennent jamais au visiteur. On suffixe donc chaque appel par l'empreinte
// du contenu, ce qui force le rechargement quand, et seulement quand, le
// fichier a changé.
//
// À lancer avant chaque publication : node tools/version-assets.mjs
import fs from 'fs';
import crypto from 'crypto';

const ACTIFS = ['assets/r90.css', 'assets/r90.js', 'assets/data.js',
                'assets/docs.js', 'assets/photos.js', 'assets/arcade.js'];

const empreinte = f => fs.existsSync(f)
  ? crypto.createHash('sha1').update(fs.readFileSync(f)).digest('hex').slice(0, 8)
  : null;

const versions = {};
for (const a of ACTIFS) { const e = empreinte(a); if (e) versions[a] = e; }

const pages = fs.readdirSync('.').filter(f => f.endsWith('.html'));
let touchees = 0;

for (const page of pages) {
  let html = fs.readFileSync(page, 'utf8');
  const avant = html;
  for (const [chemin, v] of Object.entries(versions)) {
    // remplace chemin ou chemin?v=ancien par chemin?v=nouveau
    const re = new RegExp(chemin.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(\\?v=[a-f0-9]+)?', 'g');
    html = html.replace(re, chemin + '?v=' + v);
  }
  if (html !== avant) { fs.writeFileSync(page, html); touchees++; console.log('version →', page); }
}

console.log('\nempreintes :');
for (const [c, v] of Object.entries(versions)) console.log('  ' + c + ' ?v=' + v);
console.log(touchees + ' page(s) mise(s) à jour sur ' + pages.length + '.');
