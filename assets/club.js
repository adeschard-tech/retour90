function R90PAGE(){
  const AV=[{"id":"pop:console","label":"Console portable","file":"assets/avatars/console.svg"},{"id":"pop:cassette","label":"Cassette de la boum","file":"assets/avatars/cassette.svg"},{"id":"pop:tele","label":"Télé du mercredi","file":"assets/avatars/tele.svg"},{"id":"pop:skate","label":"Roi du bitume","file":"assets/avatars/skate.svg"},{"id":"pop:smiley","label":"Bonne humeur","file":"assets/avatars/smiley.svg"},{"id":"pop:alien","label":"Visiteur du futur","file":"assets/avatars/alien.svg"},{"id":"pop:basket","label":"Basket du gymnase","file":"assets/avatars/basket.svg"},{"id":"pop:casque","label":"Toujours en musique","file":"assets/avatars/casque.svg"},{"id":"pop:pizza","label":"Une part pour la route","file":"assets/avatars/pizza.svg"},{"id":"pop:etoile","label":"Star de la récré","file":"assets/avatars/etoile.svg"}];
  const avatarHTML=value=>{const a=AV.find(a=>a.id===value);return a?`<img src="${a.file}" alt="Avatar : ${esc(a.label)}" width="72" height="72">`:`<span class="avatar-letter">${esc(String(value||'R').slice(0,2))}</span>`};
  const POGS=[
   ['tele','Le Mercredi','📺'],['manga','Kaméhaméha','🐉'],['musique','Mélomane','📻'],['cine','Vidéoclub','🎬'],
   ['jeux','Cartouche','🕹️'],['pub','Le Jingle','📣'],['sport','12 Juillet','⚽'],['actu','La Une','🗞️'],
   ['objets','Le Grenier','📦'],['food','16h30','🍬'],['arcade','La Borne','👾'],['club','La Carte','🎟️'],
   ['snake','Serpent d’or','🐍'],['simon','Mémoire de fer','🧠'],['quiz','Zappeur pro','❓'],['post','Grande gueule','💬'],
   ['pseudo','Membre officiel','✍️'],['jours','Abonné fidèle','📅'],['bricks','Casseur','🧱'],['mines','Démineur','💣'],
   ['inv','Défenseur','🛸'],['tama','Éleveur','🥚'],['nuit','Noctambule','🌙'],['souvenir','Mémorialiste','📼'],
   ['tout','Zappeur total','🏆','foil'],['konami','↑↑↓↓←→←→BA','🎮','foil']
  ];
  const P1=['#FF2E87','#23E5DE','#FFD23F','#FF7A2F','#9BF04D','#B57BFF'];
  function unlocked(){
    const u=new Set();
    ['tele','manga','musique','cine','jeux','pub','sport','actu','objets','food','arcade','club'].forEach(p=>{if(S.vus.includes(p))u.add(p)});
    if(S.hi.snake>=10)u.add('snake');
    if(S.hi.simon>=6)u.add('simon');
    if(S.hi.quiz>=6)u.add('quiz');
    if(S.hi.bricks>=200)u.add('bricks');
    if(S.hi.mines>=1)u.add('mines');
    if(S.hi.inv>=200)u.add('inv');
    if(S.posts.some(p=>p.published))u.add('post');
    if(S.pseudo)u.add('pseudo');
    if(S.days.length>=3)u.add('jours');
    if(S.vus.length>=13)u.add('tout');
    if(new Date().getHours()<5)u.add('nuit');
    if(S.tama&&S.tama.n>=5)u.add('tama');
    try{if(Object.keys(JSON.parse(localStorage.getItem('retour90.cmts')||'{}')).length>=1)u.add('souvenir')}catch(e){}
    return u;
  }
  function drawCard(){
    const u=unlocked();
    $('#carte').innerHTML=`<div class="member-card-top"><div class="member-avatar">${avatarHTML(S.avatar)}</div><div><div class="member-kicker">RETOUR90 · LA CARTE DU CLUB</div><div class="member-name">${esc(S.pseudo||'Ton pseudo ici')}</div></div></div><p class="member-note">${S.days.length} jour(s) de visite · ${S.vus.length}/13 canaux explorés<br>Ta carte et tes scores restent dans ce navigateur.</p><div class="stats"><div class="stat"><b>${u.size}/${POGS.length}</b><span>POGS</span></div><div class="stat"><b>${S.hi.snake}</b><span>Snake</span></div><div class="stat"><b>${S.hi.simon}</b><span>Simon</span></div><div class="stat"><b>${S.hi.bricks}</b><span>Casse-briques</span></div><div class="stat"><b>${S.hi.inv}</b><span>Invasion</span></div><div class="stat"><b>${S.hi.mines}</b><span>Démineur</span></div></div>`;
    $('#pogcnt').textContent=u.size+'/'+POGS.length;
    $('#pogbar').style.width=Math.round(u.size/POGS.length*100)+'%';
    $('#pogwall').innerHTML=POGS.map((p,i)=>{const on=u.has(p[0]);return `<figure class="pog-card ${on?'':'is-locked'}" title="${esc(p[1])}"><img src="assets/pogs/${String(i+1).padStart(2,'0')}.png" alt="POG Avimage de la série ESSO nº 1" width="200" height="200" loading="lazy"><figcaption><strong>${esc(p[1])}</strong><span class="pog-state">${on?'Dans ton classeur':'À débloquer'} · ${String(i+1).padStart(2,'0')}</span></figcaption></figure>`}).join('');
  }
  // réglages
  $('#fPseudo').value=S.pseudo||'';
  $('#avs').innerHTML=AV.map(a=>`<button type="button" class="avatar-choice" data-av="${a.id}" aria-label="${esc(a.label)}" aria-pressed="${a.id===S.avatar}"><img src="${a.file}" alt="" width="72" height="72"><span>${esc(a.label)}</span></button>`).join('');
  document.querySelectorAll('#avs [data-av]').forEach(b=>b.onclick=()=>{S.avatar=b.dataset.av;save();document.querySelectorAll('#avs [data-av]').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.av===S.avatar)));blip(620,.05);drawCard()});
  $('#saveCard').onclick=()=>{
    const v=$('#fPseudo').value.trim();
    if(v.length<2){toast('IL FAUT AU MOINS 2 CARACTÈRES');return}
    const first=!S.pseudo;S.pseudo=v.slice(0,22);save();
    toast(first?'BIENVENUE AU CLUB, '+S.pseudo.toUpperCase():'CARTE MISE À JOUR');
    blip(660,.08);setTimeout(()=>blip(990,.14),120);drawCard()};

  // Le forum n'affiche que les messages réellement renvoyés par le service.
  const THREADS=[
    {t:'Le 12 juillet 1998, tu étais où ?',k:'ON ÉTAIT CHAMPIONS',d:'Le salon, la rue, le camping ? Raconte le décor. On entend déjà les klaxons.'},
    {t:'Le détail qui trahit ta génération',k:'LES VRAIS SAVENT',d:'Un bruit, une habitude, une phrase. Le petit truc qui nous ramène immédiatement là-bas.'},
    {t:'Les trésors du grenier',k:'SURTOUT, NE JETTE PAS ÇA',d:'Un vieux jeu retrouvé, une cassette sauvée, un objet qui fonctionne encore. Raconte-nous ta trouvaille.'},
    {t:'L’opercule, on le lèche ou pas ?',k:'LE GRAND DÉBAT',d:'Les grandes questions méritent de petits débats. Les arguments absurdes sont les bienvenus, les attaques personnelles beaucoup moins.'},
    {t:'Mais c’était quoi, ce dessin animé ?',k:'AVIS DE RECHERCHE',d:'Une scène, une couleur, un bout de générique ? Donne les indices. Quelqu’un a peut-être la réponse.'}
  ];
  let LIVE={},activeThread=0,forumBusy=false,forumLoaded=false,forumError=false;
  const draftKey='retour90.forum.brouillons';
  let drafts={};try{drafts=JSON.parse(localStorage.getItem(draftKey)||'{}')}catch{}
  const keepDraft=()=>{try{localStorage.setItem(draftKey,JSON.stringify(drafts))}catch{}};
  const forumDate=value=>{const d=new Date(value);return Number.isNaN(d.getTime())?'':d.toLocaleString('fr-FR',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'})};
  function drawForum(){
    const total=Object.values(LIVE).reduce((n,list)=>n+list.length,0);
    $('#forum').innerHTML=`<div class="forum-toolbar"><span>${forumError?'Connexion indisponible':forumLoaded?total+' souvenir'+(total>1?'s':'')+' partagé'+(total>1?'s':''):'On ouvre les conversations…'}</span><button class="text-link" id="forum-refresh" type="button">Actualiser</button></div><div class="forum-layout"><nav class="forum-topics" aria-label="Choisir une conversation">${THREADS.map((t,i)=>`<button type="button" class="topic" data-topic="${i}" aria-pressed="${i===activeThread}"><span class="topic-number">0${i+1}</span><span><small>${t.k}</small><strong>${esc(t.t)}</strong><span class="topic-count">${forumLoaded?(LIVE[i]||[]).length+' message'+((LIVE[i]||[]).length>1?'s':''):'Chargement…'}</span></span></button>`).join('')}</nav><section class="forum-panel" aria-labelledby="conversation-title"><header class="conversation-head"><span class="eyebrow">${THREADS[activeThread].k}</span><h3 id="conversation-title">${esc(THREADS[activeThread].t)}</h3><p>${THREADS[activeThread].d}</p></header><div class="forum-messages">${(LIVE[activeThread]||[]).map(p=>`<article class="forum-post"><div class="forum-avatar" aria-hidden="true">${avatarHTML(p.avatar||p.pseudo?.slice(0,1))}</div><div class="forum-post-body"><header><strong>${esc(p.pseudo||'Visiteur')}</strong><time datetime="${esc(p.created_at)}">${forumDate(p.created_at)}</time></header><p>${esc(p.body)}</p></div></article>`).join('')||`<div class="forum-empty"><strong>${forumError?'Les souvenirs arrivent dès que la connexion revient.':forumLoaded?'Le premier souvenir pourrait être le tien.':'On récupère les souvenirs…'}</strong><p>${forumError?'Tu peux préparer ton message. Il restera dans ce navigateur tant que l’envoi n’a pas réussi.':'Pas besoin d’écrire un roman. Le détail dont tu te souviens suffit.'}</p></div>`}</div><form class="forum-compose" id="forum-reply"><h4>À ton tour de raconter.</h4><label for="forum-pseudo">Ton pseudo</label><input class="field" id="forum-pseudo" name="pseudo" minlength="2" maxlength="22" required autocomplete="nickname" value="${esc(S.pseudo||'')}" placeholder="Celui de Caramail est accepté"><label for="forum-body">Ton souvenir</label><textarea class="field" id="forum-body" name="body" rows="4" minlength="3" maxlength="800" required placeholder="Je me souviens…">${esc(drafts[activeThread]||'')}</textarea><div class="compose-meta"><span>Message public. On se parle avec respect.</span><span id="forum-count">${(drafts[activeThread]||'').length}/800</span></div><div class="compose-send"><button class="btn" type="submit">Publier mon souvenir</button><p id="forum-status" role="status" aria-live="polite"></p></div></form></section></div>`;
    document.querySelectorAll('#forum [data-topic]').forEach(b=>b.onclick=()=>{
      if(forumBusy)return;activeThread=Number(b.dataset.topic);drawForum();
      $('#forum [data-topic="'+activeThread+'"]').focus();
    });
    $('#forum-body').oninput=e=>{drafts[activeThread]=e.target.value;keepDraft();$('#forum-count').textContent=e.target.value.length+'/800'};
    $('#forum-refresh').onclick=async()=>{if(forumBusy)return;forumBusy=true;$('#forum-refresh').disabled=true;await loadForum();forumBusy=false};
    $('#forum-reply').onsubmit=async e=>{
      e.preventDefault();if(forumBusy)return;
      const body=$('#forum-body').value.trim(),pseudo=$('#forum-pseudo').value.trim();
      if(body.length<3||pseudo.length<2)return;
      const thread=activeThread,button=$('#forum-reply button[type=submit]'),status=$('#forum-status');
      forumBusy=true;button.disabled=true;button.textContent='Envoi en cours…';status.textContent='';
      try{
        await sbPost('forum_posts',{thread,pseudo,avatar:S.avatar||pseudo.slice(0,1).toUpperCase(),body});
        S.pseudo=pseudo;S.posts.push({t:thread,m:body,published:true});save();
        delete drafts[thread];keepDraft();$('#fPseudo').value=pseudo;
        await loadForum();drawCard();$('#forum-status').textContent=forumError?'Ton souvenir est publié. Actualise pour le voir apparaître.':'Ton souvenir est publié. Merci de l’avoir partagé !';
      }catch{
        status.textContent='L’envoi n’a pas abouti. Ton texte est conservé ici, tu peux réessayer.';
        button.disabled=false;button.textContent='Réessayer l’envoi';
      }finally{forumBusy=false}
    };
  }
  async function loadForum(){
    try{
      const rows=await sbGet('/forum_posts?order=created_at.desc&limit=300');
      const next={};rows.forEach(r=>{if(Number.isInteger(r.thread)&&THREADS[r.thread])(next[r.thread]??=[]).push(r)});
      LIVE=next;forumLoaded=true;forumError=false;
    }catch{forumError=true}
    drawForum();
  }

  // inscription au Club
  $('#mPseudo').value=S.pseudo||'';
  $('#mGo').onclick=async()=>{
    const ps=$('#mPseudo').value.trim(),em=$('#mEmail').value.trim();
    if(ps.length<2){$('#mMsg').textContent='IL FAUT UN PSEUDO (2 CARACTÈRES MINIMUM).';return}
    if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)){$('#mMsg').textContent='CET EMAIL A L\'AIR BANCAL, VÉRIFIE-LE.';return}
    try{
      await sbPost('members',{pseudo:ps.slice(0,22),email:em.toLowerCase()});
      S.pseudo=S.pseudo||ps.slice(0,22);save();
      $('#mMsg').textContent='BIENVENUE AU CLUB ! TU ES SUR LA LISTE.';
      toast('INSCRIT AU CLUB, '+ps.toUpperCase());blip(660,.08);setTimeout(()=>blip(990,.14),120);
      drawCard();
    }catch(e){
      $('#mMsg').textContent=String(e).includes('409')?'CET EMAIL EST DÉJÀ MEMBRE DU CLUB.':'IMPOSSIBLE POUR L\'INSTANT, RÉESSAIE PLUS TARD.';
    }
  };
  // courrier des téléspectateurs
  $('#cGo').onclick=async()=>{
    const body=$('#cBody').value.trim();
    if(body.length<5){$('#cMsg').textContent='ÉCRIS AU MOINS UNE PHRASE.';return}
    try{
      await sbPost('contact_messages',{name:$('#cNom').value.trim()||null,email:$('#cEmail').value.trim()||null,body:body.slice(0,2000)});
      $('#cBody').value='';$('#cMsg').textContent='COURRIER ENVOYÉ. ON LE LIT, PROMIS.';
      toast('COURRIER ENVOYÉ');blip(700,.08);
    }catch(e){$('#cMsg').textContent='ENVOI IMPOSSIBLE POUR L\'INSTANT, RÉESSAIE PLUS TARD.'}
  };
  drawCard();loadForum();
}
