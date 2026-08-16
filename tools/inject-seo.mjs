// RETOUR90 — injection SEO/AEO : canonical, Open Graph, Twitter Cards, JSON-LD
// Idempotent : le bloc entre <!--SEO--> et <!--/SEO--> est remplacé à chaque exécution.
import fs from 'fs';

const SITE = 'https://retour90.fr';
const OG = SITE + '/assets/og.jpg';

const PAGES = {
  'index.html':  { path: '/',            crumb: null },
  'tele.html':   { path: '/tele.html',   crumb: 'Télé' },
  'manga.html':  { path: '/manga.html',  crumb: 'Manga' },
  'musique.html':{ path: '/musique.html',crumb: 'Musique' },
  'cine.html':   { path: '/cine.html',   crumb: 'Ciné' },
  'jeux.html':   { path: '/jeux.html',   crumb: 'Jeux vidéo' },
  'pub.html':    { path: '/pub.html',    crumb: 'Pubs' },
  'sport.html':  { path: '/sport.html',  crumb: 'Sport' },
  'actu.html':   { path: '/actu.html',   crumb: 'Actu' },
  'objets.html': { path: '/objets.html', crumb: 'Objets' },
  'food.html':   { path: '/food.html',   crumb: 'Miam' },
  'arcade.html': { path: '/arcade.html', crumb: 'Arcade' },
  'club.html':   { path: '/club.html',   crumb: 'Le Club' },
};

const FAQ = [
  ["C'est quoi, RETOUR90 ?",
   "RETOUR90.FR est un site hommage gratuit aux années 90 en France : les vrais génériques télé, les vraies publicités, les vrais clips et les vrais journaux télévisés d'époque, plus des jeux d'arcade jouables et un club de souvenirs."],
  ["Les vidéos sont-elles authentiques ?",
   "Oui. Les 187 vidéos sont des documents d'époque lus via le lecteur YouTube officiel, depuis les chaînes qui les publient : l'INA, les chaînes officielles d'artistes et de studios, et des archives publicitaires reconnues."],
  ["Le site est-il gratuit ?",
   "Entièrement. Aucun compte n'est nécessaire pour regarder les archives, jouer à l'arcade ou lire le forum. L'inscription au Club (pseudo + email) sert uniquement à être prévenu des nouveautés."],
  ["Comment rejoindre le Club RETOUR90 ?",
   "Sur la page Le Club : choisis un pseudo, laisse ton email, et tu reçois un email de bienvenue. Tu peux ensuite poster tes souvenirs sur le forum et commenter chaque dossier du site."],
  ["Puis-je proposer un souvenir ou une vidéo ?",
   "Oui — chaque page a des dossiers commentables, et le formulaire « Écrire à la chaîne » permet d'envoyer une idée, un objet pour le Grenier ou une vidéo introuvable. Chaque message est lu."],
];

const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

for (const [file, cfg] of Object.entries(PAGES)) {
  let html = fs.readFileSync(file, 'utf8');
  const title = (html.match(/<title>([^<]+)<\/title>/) || [,''])[1];
  const desc  = (html.match(/<meta name="description" content="([^"]+)"/) || [,''])[1];
  const url   = SITE + cfg.path;

  const ld = [];
  if (file === 'index.html') {
    ld.push({ '@context':'https://schema.org','@type':'WebSite', name:'RETOUR90.FR', alternateName:'Retour90',
      url:SITE, description:desc, inLanguage:'fr-FR' });
    ld.push({ '@context':'https://schema.org','@type':'Organization', name:'RETOUR90.FR', url:SITE,
      logo:OG, email:'contact@retour90.fr',
      description:"Site hommage français aux années 90 — archives d'époque, jeux et communauté." });
    ld.push({ '@context':'https://schema.org','@type':'FAQPage',
      mainEntity: FAQ.map(([q,a]) => ({ '@type':'Question', name:q, acceptedAnswer:{ '@type':'Answer', text:a } })) });
  } else {
    ld.push({ '@context':'https://schema.org','@type':'WebPage', name:title, description:desc, url,
      inLanguage:'fr-FR', isPartOf:{ '@type':'WebSite', name:'RETOUR90.FR', url:SITE } });
    ld.push({ '@context':'https://schema.org','@type':'BreadcrumbList', itemListElement:[
      { '@type':'ListItem', position:1, name:'Accueil', item:SITE+'/' },
      { '@type':'ListItem', position:2, name:cfg.crumb, item:url } ] });
  }

  const block = `<!--SEO-->
<link rel="canonical" href="${url}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="RETOUR90.FR">
<meta property="og:locale" content="fr_FR">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${OG}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${OG}">
${ld.map(o => '<script type="application/ld+json">' + JSON.stringify(o) + '</scr' + 'ipt>').join('\n')}
<!--/SEO-->`;

  html = html.replace(/<!--SEO-->[\s\S]*?<!--\/SEO-->\n?/, '');
  html = html.replace('</head>', block + '\n</head>');
  fs.writeFileSync(file, html);
  console.log('SEO →', file);
}
console.log('Terminé.');
