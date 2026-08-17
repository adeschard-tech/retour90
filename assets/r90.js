/* =====================================================
   RETOUR90.FR — moteur commun
   ===================================================== */
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const COL=['#FF2E87','#23E5DE','#FFD23F','#FF7A2F','#9BF04D','#B57BFF'];
const cc=i=>COL[i%COL.length];
const thumb=id=>'https://i.ytimg.com/vi/'+id+'/hqdefault.jpg';
const thumbHQ=id=>'https://i.ytimg.com/vi/'+id+'/mqdefault.jpg';

/* ---------- état ---------- */
const KEY='retour90.v1';
const DEF={pseudo:'',avatar:'R',vus:[],pogs:[],posts:[],days:[],hi:{snake:0,simon:0,quiz:0},tama:null};
let S;try{S=Object.assign({},DEF,JSON.parse(localStorage.getItem(KEY)||'{}'))}catch(e){S=Object.assign({},DEF)}
S.hi=Object.assign({snake:0,simon:0,quiz:0,bricks:0,inv:0,mines:0},S.hi||{});
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};

function toast(m){let t=$('#toast');if(!t){t=document.createElement('div');t.id='toast';document.body.appendChild(t)}
  t.textContent=m;t.classList.add('show');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('show'),2600)}

/* ---------- son d'interface ---------- */
let AC=null;const ac=()=>{if(!AC){try{AC=new (window.AudioContext||window.webkitAudioContext)()}catch(e){}}
  if(AC&&AC.state==='suspended')AC.resume();return AC};
function blip(f=660,d=.06,type='square',g=.045){const c=ac();if(!c)return;
  const o=c.createOscillator(),v=c.createGain();o.type=type;o.frequency.value=f;
  v.gain.setValueAtTime(g,c.currentTime);v.gain.exponentialRampToValueAtTime(.0001,c.currentTime+d);
  o.connect(v).connect(c.destination);o.start();o.stop(c.currentTime+d)}

/* ---------- structure du site ---------- */
const PAGES=[
 ['index','Accueil','00'],
 ['tele','Télé','01'],
 ['manga','Manga','02'],
 ['musique','Musique','03'],
 ['cine','Ciné','04'],
 ['jeux','Jeux vidéo','05'],
 ['pub','Pubs','06'],
 ['sport','Sport','07'],
 ['actu','Actu','08'],
 ['objets','Objets','09'],
 ['food','Miam','10'],
 ['arcade','Arcade','11'],
 ['club','Le Club','12']
];
const HERE=(location.pathname.split('/').pop()||'index.html').replace('.html','')||'index';

function shell(){
  // topbar
  const tb=document.createElement('header');tb.className='topbar';
  tb.innerHTML=`<div class="topbar-in">
    <a class="logo" href="index.html">RETOUR<b>90</b><i>.FR</i></a>
    <nav class="nav" aria-label="Canaux">${PAGES.filter(p=>p[0]!=='index').map(p=>
      `<a href="${p[0]}.html" ${HERE===p[0]?'aria-current="page"':''}><span class="n">${p[2]}</span>${p[1]}</a>`).join('')}
    </nav></div>`;
  document.body.prepend(tb);
  // OSD
  const osd=document.createElement('div');osd.className='osd';
  osd.innerHTML='<span class="rec">REC</span><span id="osdclk">--:--</span><span>SP&nbsp;·&nbsp;PAL</span>';
  document.body.appendChild(osd);
  setInterval(()=>{const d=new Date();const el=$('#osdclk');
    if(el)el.textContent=String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0')},1000);
  // footer
  const ft=document.createElement('footer');ft.className='footer';
  ft.innerHTML=`<div class="footer-in">
    <div><div class="logo">RETOUR<b style="color:var(--mag)">90</b><i style="font-style:normal;font-family:var(--mono);font-size:10px;color:var(--dim);letter-spacing:.2em">.FR</i></div>
      <p>Le site hommage aux années 90. Génériques, pubs, clips, buts, consoles, goûters :
      tout ce qu'on a vécu entre 1990 et 1999, réuni au même endroit pour un grand bol de nostalgie.</p></div>
    <div><h5>Les canaux</h5>${PAGES.slice(1,8).map(p=>`<a href="${p[0]}.html">${p[1]}</a>`).join('')}</div>
    <div><h5>Et aussi</h5>${PAGES.slice(8).map(p=>`<a href="${p[0]}.html">${p[1]}</a>`).join('')}
      <a href="club.html">S'inscrire au Club</a>
      <a href="audimat.html">L'Audimat du site</a></div>
   </div>
   <div class="footer-bottom">RETOUR90.FR · SITE HOMMAGE · LES VIDÉOS SONT LUES DEPUIS YOUTUBE (INA, CHAÎNES OFFICIELLES) · FAIT AVEC ❤ ET UN MAGNÉTOSCOPE</div>`;
  document.body.appendChild(ft);
  // pages vues + jours de présence (pour le club)
  if(!S.vus.includes(HERE)){S.vus.push(HERE)}
  const today=new Date().toISOString().slice(0,10);
  if(!S.days.includes(today)){S.days.push(today)}
  save();
}

/* ---------- data ---------- */
const R90=window.R90||[];
const byCat=c=>R90.filter(v=>v.cat===c);
const byGenre=g=>R90.filter(v=>v.genre===g);

/* ---------- backend (Supabase, cle publiable — RLS activee) ---------- */
const SB_URL='https://oajbjsevqefacdxkikmm.supabase.co/rest/v1';
const SB_KEY='sb_publishable_iZh8oydNNpoM7eIvGwl9aA_iTRxeZDy';
const SB_H={'apikey':SB_KEY,'Content-Type':'application/json'};
async function sbGet(path){
  const r=await fetch(SB_URL+path,{headers:SB_H,signal:AbortSignal.timeout(8000)});
  if(!r.ok)throw new Error('sb '+r.status);
  return r.json();
}
async function sbPost(table,body){
  const r=await fetch(SB_URL+'/'+table,{method:'POST',headers:SB_H,body:JSON.stringify(body),signal:AbortSignal.timeout(8000)});
  if(!r.ok)throw new Error('sb '+r.status);
}

/* ---------- audimat : mesure d'audience anonyme (ni cookie, ni IP, ni traceur) ---------- */
function track(){
  try{
    if(!/(^|\.)retour90\.fr$/i.test(location.hostname))return;   // rien en local ni en preview
    if(navigator.webdriver)return;
    const neuf=!sessionStorage.getItem('r90.vu');
    if(neuf)sessionStorage.setItem('r90.vu','1');
    let ref=null;
    if(document.referrer){
      try{const h=new URL(document.referrer).hostname.replace(/^www\./,'');
        if(!/retour90\.fr$/i.test(h))ref=h.slice(0,80);}catch(e){}
    }
    const vw=Math.round(innerWidth||0);
    fetch(SB_URL+'/hits',{method:'POST',headers:SB_H,keepalive:true,body:JSON.stringify({
      page:HERE.slice(0,40),ref,neuf,vw:(vw>=100&&vw<=9999)?vw:null
    })}).catch(()=>{});
  }catch(e){}
}

/* ---------- photos réelles dans les fiches ---------- */
function renderPhotos(){
  const PH=window.PHOTOS||{};
  $$('.fiche').forEach(f=>{
    if($('.ph',f))return;
    const h=$('.h',f);if(!h)return;
    const p=PH[slugify(h.textContent)];if(!p)return;
    const sp=document.createElement('span');sp.className='ph';
    sp.innerHTML=`<img loading="lazy" src="${p.f}" alt="${esc(p.t)}" title="${esc(p.c)}">`;
    f.prepend(sp);
  });
}

/* ---------- LA TV (lecteur de page) ---------- */
let tvEl=null;
function tvMount(){
  tvEl=$('#tv');if(!tvEl)return;
  tvEl.innerHTML=`<div class="tv-shell">
    <div class="tv-screen"><div class="tv-idle"><div class="snow"></div>
      <p><b>${tvEl.dataset.idle||'CHOISIS UNE VIDÉO'}</b>clique sur une vignette — elle passe à l'antenne ici</p></div></div>
    <div class="tv-side">
      <div class="tv-led" aria-hidden="true"></div>
      <button class="tv-knob up" data-dir="-1" title="Vidéo précédente"
        aria-label="Vidéo précédente"></button>
      <button class="tv-knob down" data-dir="1" title="Vidéo suivante"
        aria-label="Vidéo suivante"></button>
      <div class="tv-speaker" aria-hidden="true"></div>
      <div class="tv-badge" aria-hidden="true">RETOUR90 · CRT-2000</div>
    </div>
    <div class="tv-bar"><span class="play">■ STOP</span><span class="title">—</span>
      <button class="close" hidden>⏏ ÉJECTER</button></div></div>`;
  $('.close',tvEl).onclick=tvStop;
  $$('.tv-knob',tvEl).forEach(k=>k.onclick=()=>{
    k.classList.remove('turn');void k.offsetWidth;k.classList.add('turn');
    tvStep(+k.dataset.dir);
  });
}

/* Les molettes changent de chaîne : elles parcourent le mur de vignettes de
   la page, dans l'ordre où il est affiché, et bouclent aux deux bouts —
   comme un vrai bouton de chaîne, on ne tombe jamais sur du vide. Si la TV
   est éteinte, la molette allume la première (ou la dernière en arrière). */
function tvStep(dir){
  const vids=$$('.vid');
  if(!vids.length){toast('AUCUNE VIDÉO SUR CETTE PAGE');return}
  const cur=vids.findIndex(v=>v.classList.contains('now'));
  const next=cur<0?(dir>0?0:vids.length-1)
                  :(cur+dir+vids.length)%vids.length;
  const b=vids[next];
  tvPlay(b.dataset.id,b.dataset.t,b);
}
function tvPlay(id,title,card){
  if(!tvEl)return;
  const scr=$('.tv-screen',tvEl);
  scr.innerHTML=`<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0"
    title="${esc(title)}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
  $('.tv-shell',tvEl).classList.add('on');
  $('.play',tvEl).textContent='▶ PLAY';$('.play',tvEl).style.color='var(--lime)';
  $('.title',tvEl).textContent=title;
  $('.close',tvEl).hidden=false;
  $$('.vid.now').forEach(v=>v.classList.remove('now'));
  if(card)card.classList.add('now');
  /* On ne recadre que si la TV n'est pas déjà bien en vue : sinon, enchaîner
     les molettes ferait sauter l'écran sous le doigt à chaque chaîne. */
  const r=tvEl.getBoundingClientRect();
  if(r.top<60||r.top>window.innerHeight*.5)
    window.scrollTo({top:r.top+window.scrollY-70,behavior:'smooth'});
  blip(520,.05);
}
function tvStop(){
  if(!tvEl)return;
  $('.tv-screen',tvEl).innerHTML=`<div class="tv-idle"><div class="snow"></div>
    <p><b>FIN DE LA CASSETTE</b>choisis une autre vidéo dans le mur</p></div>`;
  $('.tv-shell',tvEl).classList.remove('on');
  $('.play',tvEl).textContent='■ STOP';$('.title',tvEl).textContent='—';
  $('.close',tvEl).hidden=true;
  $$('.vid.now').forEach(v=>v.classList.remove('now'));
}

/* ---------- LE WALKMAN — la K7 qui te suit de page en page ----------
   Un baladeur flottant en bas à droite, présent partout. Il joue les
   vrais clips (lecteur YouTube officiel piloté par l'IFrame API) et
   mémorise la cassette, la piste et la position : en changeant de page,
   un seul geste — ▶ REPRENDRE — et la musique repart où elle en était. */
const WK=(function(){
  const K7S=[
    {g:'eurodance',n:'DANCE'},{g:'rapfr',n:'RAP FR'},{g:'pop',n:'TOP 50'},
    {g:'frenchtouch',n:'FRENCH'},{g:'rock',n:'ROCK'},{g:'slow',n:'SLOWS'}
  ];
  const KEYW='retour90.wk';
  let st;try{st=JSON.parse(localStorage.getItem(KEYW)||'null')}catch(e){st=null}
  if(!st)st={g:null,idx:0,t:0,playing:false,min:true};
  const saveW=()=>{try{localStorage.setItem(KEYW,JSON.stringify(st))}catch(e){}};
  let player=null,ready=false,el=null,tick=null;

  const ids=()=>st.g?byGenre(st.g).map(v=>v.id):[];
  const cur=()=>st.g?byGenre(st.g)[st.idx]:null;

  function mount(){
    el=document.createElement('div');el.id='wk';if(st.min)el.classList.add('min');
    el.innerHTML=`
      <div class="wk-top" id="wktop"><span class="dot"></span><span>WALKMAN</span>
        <span class="nm" id="wknm">${st.g?'· '+K7S.find(k=>k.g===st.g).n:'· choisis une K7'}</span>
        <button id="wkmin" aria-label="Replier le walkman">${st.min?'▲':'▼'}</button></div>
      <div class="wk-screenwrap"><div id="wkscreen"></div>
        <div class="wk-hold" id="wkhold">
          <button id="wkgo">${st.g?'▶ Reprendre':'▶ Mettre la K7'}</button>
          <div class="h">${st.g?'la cassette est restée dans le baladeur':'6 cassettes, vrais clips'}</div>
        </div></div>
      <div class="wk-k7s" id="wkk7s">${K7S.map(k=>`<button data-g="${k.g}" class="${k.g===st.g?'on':''}">${k.n}</button>`).join('')}</div>
      <div class="wk-ctl">
        <button id="wkprev" aria-label="Piste précédente">⏮</button>
        <button id="wkpp" aria-label="Lecture / pause">⏯</button>
        <button id="wknext" aria-label="Piste suivante">⏭</button></div>
      <div class="wk-foot" id="wkfoot">SIDE A · AUTOREVERSE</div>`;
    document.body.appendChild(el);
    $('#wkmin').onclick=e=>{e.stopPropagation();st.min=!st.min;el.classList.toggle('min',st.min);
      $('#wkmin').textContent=st.min?'▲':'▼';saveW()};
    $('#wktop').onclick=()=>{if(st.min){st.min=false;el.classList.remove('min');$('#wkmin').textContent='▼';saveW()}};
    $('#wkgo').onclick=()=>{if(!st.g)st.g=K7S[0].g;start(true)};
    $$('#wkk7s button').forEach(b=>b.onclick=()=>{st.g=b.dataset.g;st.idx=0;st.t=0;start(true)});
    $('#wkprev').onclick=()=>skip(-1);
    $('#wknext').onclick=()=>skip(1);
    $('#wkpp').onclick=()=>{if(!player||!ready){$('#wkgo').click();return}
      const s=player.getPlayerState();
      if(s===1){player.pauseVideo()}else{player.playVideo()}};
    paint();
  }
  function loadAPI(cb){
    if(window.YT&&window.YT.Player)return cb();
    const prev=window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady=()=>{if(prev)prev();cb()};
    if(!$('#ytapi')){const s=document.createElement('script');s.id='ytapi';
      s.src='https://www.youtube.com/iframe_api';document.head.appendChild(s)}
  }
  function start(user){
    const list=ids();if(!list.length)return;
    st.min=false;el.classList.remove('min');$('#wkmin').textContent='▼';
    $('#wkhold').style.display='none';
    loadAPI(()=>{
      if(player&&ready){player.loadVideoById({videoId:list[st.idx],startSeconds:st.t||0});return}
      if(player)return; // API en cours d'init
      player=new YT.Player('wkscreen',{
        videoId:list[st.idx],
        playerVars:{autoplay:1,rel:0,start:Math.floor(st.t||0),playsinline:1},
        events:{
          onReady:()=>{ready=true;player.playVideo()},
          onStateChange:e=>{
            st.playing=(e.data===1);
            el.classList.toggle('playing',st.playing);saveW();paint();
            if(e.data===0)skip(1); // fin de piste → suivante
          }
        }});
    });
    st.playing=true;saveW();paint();
    if(user)blip(660,.06);
  }
  function skip(d){
    const list=ids();if(!list.length)return;
    st.idx=(st.idx+d+list.length)%list.length;st.t=0;saveW();
    if(player&&ready){player.loadVideoById(list[st.idx])}else start(false);
    paint();blip(d>0?740:520,.05);
  }
  function paint(){
    if(!el)return;
    const c=cur();
    $('#wknm').textContent=st.g?'· '+(K7S.find(k=>k.g===st.g)||{}).n:'· choisis une K7';
    $('#wkfoot').textContent=c?('PISTE '+(st.idx+1)+'/'+ids().length+' · '+c.title):'SIDE A · AUTOREVERSE';
    $$('#wkk7s button').forEach(b=>b.classList.toggle('on',b.dataset.g===st.g));
  }
  // mémorise la position toutes les 4 s
  tick=setInterval(()=>{
    if(player&&ready&&st.playing){try{st.t=player.getCurrentTime()||0;saveW()}catch(e){}}
  },4000);
  return {mount,start,
    startGenre(g){st.g=g;st.idx=0;st.t=0;start(true)},
    open(){if(!el)return;st.min=false;el.classList.remove('min');$('#wkmin').textContent='▼'}
  };
})();

/* ---------- MURS DE VIDÉOS ---------- */
function card(v,i){
  return `<button class="vid" style="--c:${cc(i)}" data-id="${v.id}" data-t="${esc(v.title)}">
    <span class="th"><img loading="lazy" src="${thumb(v.id)}" alt="${esc(v.title)}">
      <span class="yr">${v.year||''}</span><span class="pl"></span></span>
    <span class="meta"><span class="t">${esc(v.title)}</span><span class="c">${esc(v.channel||'')}</span></span>
  </button>`;
}
function renderWalls(){
  $$('[data-wall]').forEach(w=>{
    const cat=w.dataset.wall;
    let vids=cat==='mix'?[...R90].sort(()=>Math.random()-.5)
      :cat.startsWith('genre:')?byGenre(cat.slice(6)):byCat(cat);
    const max=+w.dataset.max||999;
    vids=vids.slice(0,max);
    if(!vids.length){w.innerHTML=`<div class="box"><p class="mini" style="margin:0">▮▮▮ NUMÉRISATION DES ARCHIVES EN COURS… (le magnétoscope chauffe, reviens dans un instant)</p></div>`;return}
    w.innerHTML=vids.map(card).join('');
    const cnt=w.previousElementSibling&&$('.cnt',w.previousElementSibling);
    if(cnt)cnt.textContent=vids.length+' vidéos';
  });
  document.addEventListener('click',e=>{
    const b=e.target.closest('.vid');if(!b)return;
    tvPlay(b.dataset.id,b.dataset.t,b);
  });
}

/* ---------- K7 (playlists chaînées) ---------- */
function renderK7(){
  $$('[data-k7rack]').forEach(rk=>{
    const defs=JSON.parse(rk.dataset.k7rack);
    rk.innerHTML=defs.map((k,i)=>{
      const n=(k.genre?byGenre(k.genre):byCat(k.cat)).length;
      return `<button class="k7" style="--c:${cc(i)}" data-genre="${k.genre||''}" data-t="${esc(k.n)}">
        <span class="shell">
          <span class="stripe"></span>
          <span class="lbl"><b>${esc(k.n)}</b><span>${esc(k.s)}</span></span>
          <span class="win"><span class="tape"></span><span class="reel"></span><span class="reel"></span></span>
          <span class="foot">${n} TITRES · FACE A · 90 MIN</span>
        </span></button>`;
    }).join('');
    $$('.k7',rk).forEach(k=>k.onclick=()=>{
      const g=k.dataset.genre;
      if(!g){toast('CETTE K7 EST ENCORE VIDE');return}
      $$('.k7.on').forEach(x=>x.classList.remove('on'));k.classList.add('on');
      WK.startGenre(g);
      toast('K7 INSÉRÉE DANS LE WALKMAN → EN BAS À DROITE');
    });
  });
}

/* ---------- HERO (accueil) ---------- */
function renderHero(){
  const hw=$('#herowall');if(!hw)return;
  const pool=[...R90].sort(()=>Math.random()-.5).slice(0,40);
  hw.innerHTML=pool.map(v=>`<img loading="lazy" src="${thumbHQ(v.id)}" alt="">`).join('');
}

/* ---------- LA MADELEINE DU JOUR ---------- */
const MADELEINES=[
 ['L’odeur du Malabar','Le tatouage qu’on se collait sur le bras et qui tenait trois jours si on ne se lavait pas trop.'],
 ['Rembobiner la K7','« Merci de rembobiner la cassette avant de la rapporter. » On ne le faisait jamais.'],
 ['Le bruit du modem 56k','Douze secondes de cris stridents pour aller sur Caramail. Et maman qui décroche le téléphone.'],
 ['La disquette 3,5″','1,44 Mo. On mettait l’exposé de SVT dessus, elle plantait le jour de l’oral.'],
 ['Le générique du mercredi','La télé allumée à 8h. Le reste de la semaine, c’était l’école.'],
 ['Souffler dans la cartouche','Ça ne servait absolument à rien. Ça marchait à chaque fois.'],
 ['Le Tamagotchi mort en cours','Confisqué à 10h. Retrouvé mort à 17h. Un deuil réel.'],
 ['La compil enregistrée à la radio','Le doigt sur PAUSE, et l’animateur qui parle sur la fin du morceau. Rage.'],
 ['La cabine téléphonique','La télécarte à 50 unités, et le compteur qui descendait trop vite.'],
 ['Le Minitel','3615 et le bruit de connexion. La facture qui arrive un mois plus tard.'],
 ['Le classeur de POGS','Le slammer en métal, interdit dans la cour dès février.'],
 ['L’Eastpak à une bretelle','Deux bretelles, c’était pour les petits.'],
 ['Le vidéoclub le vendredi soir','Vingt minutes devant les jaquettes pour repartir avec le même film que la dernière fois.'],
 ['Le walkman anti-choc','Qui sautait quand même dès qu’on marchait un peu vite.'],
 ['Les Panini France 98','Il te manquait toujours le même. Toujours.'],
 ['Le CD-ROM AOL','Cent heures gratuites. Dans toutes les boîtes aux lettres de France.'],
 ['Le Champomy','La boisson qui te faisait croire que tu étais un adulte.'],
 ['La télé qui neige','Et la tape sur le côté du poste, qui marchait aussi.'],
 ['La blague du Carambar','On la lisait à voix haute. Personne ne riait. On la relisait.'],
 ['Le Nokia et Snake','Une semaine d’autonomie. Un jeu. C’était suffisant.'],
 ['La photo qu’on développe','Trois semaines d’attente pour découvrir que 12 sur 24 sont floues.'],
 ['Le générique de fin','Et la boule au ventre : demain, c’est jeudi. École.'],
 ['La cassette qui se démêle','Et le crayon Bic passé dans la bobine pour la sauver.'],
 ['Le premier email','Prenom_1985@caramail.com. On l’a gardé jusqu’en 2007.'],
 ['Le survêt trois bandes','Et le bruit caractéristique quand on courait.'],
 ['Le goûter de 16h30','Pas un encas. Un événement.'],
 ['Le samedi soir devant la Trilogie','Trois séries d’affilée jusqu’à minuit. M6 avait tout compris.'],
 ['Les 24 pages du catalogue jouets','Cornées, annotées, surlignées dès octobre.'],
 ['La borne d’arcade du camping','Un franc la partie. Trois vies. Une légende locale au record.'],
 ['Le doigt sur REC','Le geste le plus précis de toute une génération.']
];
const dayIdx=()=>{const d=new Date();return Math.floor((d-new Date(d.getFullYear(),0,0))/864e5)};
function renderMadeleine(){
  const m=$('#madeleine');if(!m)return;
  const md=MADELEINES[dayIdx()%MADELEINES.length];
  m.innerHTML=`<div style="font-family:var(--mono);font-size:11px;letter-spacing:.22em;color:var(--mag)">LA MADELEINE DU JOUR</div>
   <h3 style="font-family:var(--display);font-size:clamp(24px,4vw,40px);margin:8px 0;text-transform:uppercase;letter-spacing:.02em;font-weight:normal">${md[0]}</h3>
   <p style="margin:0;color:#DCD2F5">${md[1]}</p>
   <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:16px">
     <button class="btn sm" id="madbtn">Moi aussi je m'en souviens</button>
     <a class="btn sm ghost" href="club.html">En parler au Club</a></div>
   <div class="mini" style="margin-top:10px">Une nouvelle madeleine chaque jour. C'est la raison de revenir demain.</div>`;
  $('#madbtn').onclick=()=>{toast('ON EST DEUX.');blip(760)};
}

/* ---------- recherche ---------- */
function renderSearch(){
  const inp=$('#search');if(!inp)return;
  const out=$('#searchout');
  inp.addEventListener('input',()=>{
    const q=inp.value.trim().toLowerCase();
    if(q.length<2){out.innerHTML='';return}
    const hits=R90.filter(v=>(v.title+' '+(v.channel||'')+' '+(v.year||'')).toLowerCase().includes(q)).slice(0,12);
    out.innerHTML=hits.length?`<div class="wall compact" style="margin-top:14px">${hits.map(card).join('')}</div>`
      :`<p class="mini" style="margin-top:12px">RIEN DANS LES ARCHIVES POUR « ${esc(q).toUpperCase()} ». ESSAIE « DOROTHÉE », « SEGA », « ZIDANE »…</p>`;
  });
}

/* ---------- LE DOSSIER — toute fiche s'ouvre : infos, anecdotes,
   vidéos liées, commentaires. Clic sur .fiche ou .chip. ---------- */
const slugify=t=>t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'')
  .replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
let CMTS;try{CMTS=JSON.parse(localStorage.getItem('retour90.cmts')||'{}')}catch(e){CMTS={}}
const saveCmts=()=>{try{localStorage.setItem('retour90.cmts',JSON.stringify(CMTS))}catch(e){}};

function docMount(){
  const d=document.createElement('div');d.id='doc';
  d.innerHTML=`<div class="doc-bg"></div><div class="doc-in">
    <button class="doc-close">⏏ FERMER</button>
    <div class="doc-eyebrow">DOSSIER D'ARCHIVE</div>
    <h3 class="doc-t"></h3><div class="doc-meta"></div>
    <figure class="doc-photo" hidden><img alt=""><figcaption></figcaption></figure>
    <p class="doc-desc"></p><ul class="doc-anec"></ul>
    <div class="doc-sub">Dans les archives vidéo</div>
    <div class="doc-player"></div><div class="doc-vids"></div>
    <div class="doc-sub">Le Club en parle</div>
    <div class="doc-cmts"></div>
    <div class="doc-form">
      <textarea class="field" rows="2" placeholder="Ton souvenir, ton anecdote, ton avis…"></textarea>
      <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
        <button class="btn sm doc-post">Poster</button>
        <span class="mini doc-as"></span></div>
    </div></div>`;
  document.body.appendChild(d);
  $('.doc-bg',d).onclick=docClose;$('.doc-close',d).onclick=docClose;
  addEventListener('keydown',e=>{if(e.key==='Escape')docClose()});
  document.addEventListener('click',e=>{
    const f=e.target.closest('.fiche');
    if(f){openDoc({
      t:($('.h',f)||{}).textContent||'Sans titre',
      yr:($('.yr',f)||{}).textContent||'',
      tag:($('.tag',f)||{}).textContent||'',
      desc:($('.d',f)||{}).textContent||''});return}
    const c=e.target.closest('.chip');
    if(c)openDoc({t:c.textContent.replace(/[«»]/g,'').trim(),yr:'ANNÉES 90',tag:'panoplie',desc:''});
  });
}
let curSlug='';
function openDoc(o){
  const d=$('#doc');curSlug=slugify(o.t);
  const X=(window.DOCS||{})[curSlug]||{};
  $('.doc-t',d).textContent=o.t;
  $('.doc-meta',d).textContent=[o.yr,o.tag].filter(Boolean).join(' · ');
  const ph=(window.PHOTOS||{})[curSlug],fig=$('.doc-photo',d);
  fig.hidden=!ph;
  if(ph){$('img',fig).src=ph.f;$('img',fig).alt=ph.t;$('figcaption',fig).textContent='Photo : '+ph.c}
  $('.doc-desc',d).textContent=o.desc;
  $('.doc-anec',d).innerHTML=(X.plus||[]).map(a=>`<li>${esc(a)}</li>`).join('');
  // vidéos liées : mots-clés du dossier, sinon les mots du titre
  const terms=(X.q||o.t).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'')
    .split(/[^a-z0-9]+/).filter(w=>w.length>2&&!['les','des','pub','contre','annees'].includes(w));
  const hits=R90.map(v=>{
    const hay=(v.title+' '+(v.channel||'')).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
    return {v,s:terms.filter(t=>hay.includes(t)).length};
  }).filter(x=>x.s>0).sort((a,b)=>b.s-a.s).slice(0,4).map(x=>x.v);
  $('.doc-player',d).classList.remove('on');$('.doc-player',d).innerHTML='';
  $('.doc-vids',d).innerHTML=hits.length?hits.map(v=>
    `<button class="doc-vid" data-id="${v.id}"><img loading="lazy" src="${thumb(v.id)}" alt=""><b>${esc(v.title)}</b></button>`).join('')
    :'<span class="doc-empty">RIEN DANS LES ARCHIVES POUR L\'INSTANT — LES DOCUMENTALISTES CHERCHENT.</span>';
  $$('.doc-vid',d).forEach(b=>b.onclick=()=>{
    const p=$('.doc-player',d);p.classList.add('on');
    p.innerHTML=`<iframe src="https://www.youtube-nocookie.com/embed/${b.dataset.id}?autoplay=1&rel=0"
      allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
    p.scrollIntoView({behavior:'smooth',block:'center'});blip(520,.05)});
  drawCmts();
  $('.doc-as',d).textContent=S.pseudo?('tu postes en tant que '+S.pseudo):'sans pseudo, tu postes en visiteur — crée ta carte au Club';
  $('.doc-post',d).onclick=async()=>{
    const ta=$('.doc-form textarea',d),v=ta.value.trim();
    if(v.length<3){toast('ÉCRIS QUELQUE CHOSE');return}
    const c={n:S.pseudo||'visiteur',a:S.avatar||'?',m:v.slice(0,500),d:new Date().toISOString().slice(0,10)};
    try{
      await sbPost('comments',{slug:curSlug,pseudo:c.n,avatar:c.a,body:c.m});
      toast('SOUVENIR POSTÉ POUR TOUT LE MONDE');
    }catch(e){
      (CMTS[curSlug]=CMTS[curSlug]||[]).push(c);saveCmts();
      toast('POSTÉ EN LOCAL (HORS LIGNE)');
    }
    ta.value='';drawCmts();blip(700,.08)};
  d.classList.add('open');document.body.style.overflow='hidden';
  $('.doc-in',d).scrollTop=0;blip(440,.05);
}
async function drawCmts(){
  const d=$('#doc'),slug=curSlug;
  const paint=list=>{if(curSlug!==slug)return;
    $('.doc-cmts',d).innerHTML=list.length?list.map(c=>
      `<div class="doc-cmt"><span class="av">${esc(c.a)}</span>
       <div><b>${esc(c.n)} · ${c.d}</b><p>${esc(c.m)}</p></div></div>`).join('')
      :'<span class="doc-empty">PERSONNE N\'A ENCORE LAISSÉ SON SOUVENIR ICI. SOIS LE PREMIER.</span>'};
  paint(CMTS[slug]||[]);
  try{
    const rows=await sbGet('/comments?slug=eq.'+encodeURIComponent(slug)+'&order=created_at.asc&limit=100');
    paint(rows.map(r=>({n:r.pseudo,a:r.avatar,m:r.body,d:r.created_at.slice(0,10)})));
  }catch(e){/* hors ligne : la version locale reste affichée */}
}
function docClose(){$('#doc').classList.remove('open');$('#doc .doc-player').innerHTML='';document.body.style.overflow=''}

/* ---------- konami ---------- */
const KON=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let kk=0;
addEventListener('keydown',e=>{
  const k=e.key.length===1?e.key.toLowerCase():e.key;
  kk=(k===KON[kk])?kk+1:(k===KON[0]?1:0);
  if(kk===KON.length){kk=0;document.body.style.filter='hue-rotate(180deg)';
    setTimeout(()=>document.body.style.filter='',2500);toast('CODE KONAMI · 30 VIES');blip(880,.09);setTimeout(()=>blip(1320,.12),110)}
});

/* ---------- la page Audimat ---------- */
const PLABEL=Object.fromEntries(PAGES.map(p=>[p[0],p[1]]));
PLABEL.audimat='Audimat';
const nf=n=>String(n||0).replace(/\B(?=(\d{3})+(?!\d))/g,' ');
const jourFR=s=>new Date(s+'T12:00:00').toLocaleDateString('fr-FR',{day:'numeric',month:'short'});

async function renderAudimat(){
  const box=$('#audimat'); if(!box)return;
  box.innerHTML='<p class="lede" style="text-align:center">Lecture de la bande…</p>';
  let T,J,P,S,E;
  try{
    [T,J,P,S,E]=await Promise.all([
      sbGet('/stats_total?select=*'),
      sbGet('/stats_jours?select=*&order=jour.desc&limit=30'),
      sbGet('/stats_pages?select=*&order=vues.desc&limit=14'),
      sbGet('/stats_sources?select=*&order=visites.desc&limit=10'),
      sbGet('/stats_ecrans?select=*')
    ]);
  }catch(e){
    box.innerHTML='<div class="box"><p style="margin:0">Le magnétoscope n’arrive pas à lire la bande pour le moment. Reviens dans un instant.</p></div>';
    return;
  }
  const t=T[0]||{};
  // 30 créneaux fixes : les jours sans passage restent visibles, à zéro
  const vus=Object.fromEntries(J.map(j=>[j.jour,j]));
  const auj=new Date(new Date().toLocaleString('en-US',{timeZone:'Europe/Paris'}));
  const jours=Array.from({length:30},(_,i)=>{
    const d=new Date(auj); d.setDate(d.getDate()-(29-i));
    const k=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
    return vus[k]||{jour:k,vues:0,visites:0};
  });
  const maxJ=Math.max(1,...jours.map(j=>+j.vues));
  const maxP=Math.max(1,...P.map(p=>+p.vues));
  const maxS=Math.max(1,...S.map(s=>+s.visites));
  const totE=E.reduce((a,x)=>a+ +x.vues,0)||1;

  box.innerHTML=`
  <div class="audi-kpis">
    ${[['Visites (7 jours)',t.visites_7j,'#FF2E87'],['Pages vues (7 jours)',t.vues_7j,'#23E5DE'],
       ['Pages vues (24 h)',t.vues_24h,'#FFD23F'],['Visites depuis l’ouverture',t.visites,'#9BF04D']]
      .map(([l,v,c])=>`<div class="audi-kpi" style="--c:${c}"><b>${nf(v)}</b><span>${l}</span></div>`).join('')}
  </div>

  <h3 class="sub">La courbe des 30 derniers jours</h3>
  <div class="audi-days">${jours.map(j=>
    `<div class="audi-day${+j.vues?'':' vide'}" title="${jourFR(j.jour)} · ${j.vues} pages vues, ${j.visites} visites">
       <i style="height:${j.vues?Math.max(4,Math.round(j.vues/maxJ*100)):2}%"></i><u>${jourFR(j.jour).replace(/\s.*/,'')}</u></div>`).join('')}</div>

  <h3 class="sub">Le classement des canaux <span class="cnt">30 derniers jours</span></h3>
  <div class="audi-bars">${P.map((p,i)=>
    `<div class="audi-row" style="--c:${cc(i)}"><span class="rk">${String(i+1).padStart(2,'0')}</span>
      <a class="lb" href="${p.page}.html">${esc(PLABEL[p.page]||p.page)}</a>
      <i style="width:${Math.round(p.vues/maxP*100)}%"></i><b>${nf(p.vues)}</b></div>`).join('')
    ||'<p class="lede">Aucun canal mesuré pour l’instant.</p>'}</div>

  <div class="grid2">
    <div><h3 class="sub">D’où viennent les visiteurs</h3>
      <div class="audi-bars">${S.map((s,i)=>
        `<div class="audi-row" style="--c:${cc(i+2)}"><a class="lb" style="pointer-events:none">${esc(s.source)}</a>
          <i style="width:${Math.round(s.visites/maxS*100)}%"></i><b>${nf(s.visites)}</b></div>`).join('')
        ||'<p class="lede">Rien à signaler.</p>'}</div></div>
    <div><h3 class="sub">Sur quel écran</h3>
      <div class="audi-bars">${E.map((x,i)=>
        `<div class="audi-row" style="--c:${cc(i+4)}"><a class="lb" style="pointer-events:none">${esc(x.ecran)}</a>
          <i style="width:${Math.round(x.vues/totE*100)}%"></i><b>${Math.round(x.vues/totE*100)}&nbsp;%</b></div>`).join('')
        ||'<p class="lede">Rien à signaler.</p>'}</div></div>
  </div>`;
}

/* ---------- boot ---------- */
shell();
document.addEventListener('DOMContentLoaded',()=>{
  tvMount();renderWalls();renderK7();renderHero();renderMadeleine();renderSearch();
  WK.mount();docMount();renderPhotos();renderAudimat();track();
  if(window.R90PAGE)try{R90PAGE()}catch(e){console.error(e)}
});
