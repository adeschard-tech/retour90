/* Les petites attentions de lecture et de découverte. Aucun compte requis. */
const FAVORIS='retour90.souvenirs.v1';
function souvenirsLire(){try{return JSON.parse(localStorage.getItem(FAVORIS)||'[]')}catch{return []}}
function editionReady(){
  installerReels();
  installerWalkmanSpotify();
  // Un groupe de questions conserve une seule réponse ouverte, même sur les anciens Safari.
  document.querySelectorAll('details').forEach(detail=>{
    const group=detail.parentElement;
    detail.addEventListener('toggle',()=>{
      if(detail.open)Array.from(group.children).forEach(other=>{
        if(other!==detail&&other.tagName==='DETAILS')other.open=false;
      });
    });
  });
  const icone=(n)=>`<img src="assets/icons/${n}.svg" alt="">`;
  const entries=window.RECHERCHE||[];
  document.querySelectorAll('.fiche').forEach(f=>{
    const h=f.querySelector('.h');if(!h)return;
    const entry=entries.find(e=>e.s===slugify(h.textContent)&&e.u);if(!entry)return;
    if(!f.querySelector('.read-dossier')){const a=document.createElement('a');a.className='read-dossier';a.href=entry.u;a.textContent='Ouvrir le dossier';f.append(a)}
  });
  const slug=document.body.dataset.dossier;
  document.querySelectorAll('[data-save]').forEach(b=>{
    const key=b.dataset.save||slug;
    const paint=()=>{const saved=souvenirsLire().includes(key);b.textContent=saved?'Souvenir conservé':'Garder ce souvenir';b.setAttribute('aria-pressed',String(saved))};paint();
    b.onclick=()=>{let list=souvenirsLire();list=list.includes(key)?list.filter(s=>s!==key):[...list,key];try{localStorage.setItem(FAVORIS,JSON.stringify(list));paint();toast(list.includes(key)?'Rangé dans ta boîte à souvenirs.':'Souvenir retiré de ta boîte.')}catch{toast('Ce navigateur ne permet pas de garder ce souvenir.')}};
  });
  document.querySelectorAll('[data-share]').forEach(b=>b.onclick=async()=>{
    const url=new URL(location.href);url.search='';url.hash='';
    try{if(navigator.share)await navigator.share({title:document.title,url:url.href});else{await navigator.clipboard.writeText(url.href);toast('Le lien est copié. À toi de réveiller les souvenirs !')}}catch(e){if(e.name!=='AbortError')toast('Copie le lien dans la barre d’adresse pour le partager.')}
  });
  const filter=document.getElementById('catalog-search'),category=document.getElementById('catalog-category');
  if(filter){const apply=()=>{const q=sansAccent(filter.value.trim()),cat=category?.value||'';let n=0;document.querySelectorAll('[data-catalog-card]').forEach(c=>{c.hidden=!(sansAccent(c.textContent).includes(q)&&(!cat||c.dataset.category===cat));if(!c.hidden)n++});document.getElementById('catalog-count').textContent=n+' dossier'+(n>1?'s':'')+' à explorer';document.getElementById('catalog-empty').hidden=n>0};filter.addEventListener('input',apply);category?.addEventListener('change',apply);apply()}
  const savedList=document.getElementById('saved-list');if(savedList){const saved=souvenirsLire();document.querySelectorAll('[data-saved-card]').forEach(c=>c.hidden=!saved.includes(c.dataset.savedCard));document.getElementById('saved-empty').hidden=saved.length>0}
  document.querySelectorAll('[data-video]').forEach(b=>b.onclick=()=>{
    let v=(window.R90||[]).find(v=>v.id===b.dataset.video);if(v)tvPlay(v.id,v.title,b);
  });
  const surprise=document.getElementById('surprise');if(surprise)surprise.onclick=()=>{const docs=entries.filter(e=>e.u);if(docs.length)location.href=docs[Math.floor(Math.random()*docs.length)].u};
  const progress=document.getElementById('reading-progress');if(progress){let ticking=false;addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(()=>{const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=Math.min(100,Math.max(0,scrollY/max*100))+'%';ticking=false});ticking=true}},{passive:true})}
  const active=document.querySelector('.tv-idle');if(active){const first=document.querySelector('[data-video],.vid');if(first){const start=document.createElement('button');start.className='btn idle-start';start.textContent='Lancer la première archive';start.onclick=()=>first.click();active.querySelector('p')?.append(start)}}
  // Les anciennes images de dossiers restent créditées à portée de lecture.
  document.querySelectorAll('.fiche .ph img').forEach(img=>{img.decoding='async'});
}

/* Le lecteur officiel reste dans une fenêtre native, accessible au clavier. */
function installerReels(){
  let dialog,frame,origin;
  function fermer(){if(dialog?.open)dialog.close()}
  function creer(){
    dialog=document.createElement('dialog');dialog.className='reel-dialog';
    dialog.setAttribute('aria-labelledby','reel-title');
    dialog.innerHTML='<div class="reel-dialog-head"><span class="reel-label">RETOUR90 · SUR NOS RÉSEAUX</span><button type="button" class="reel-close" aria-label="Fermer la vidéo" autofocus>Fermer ×</button></div><div class="reel-dialog-body"><div class="reel-stage"></div><div class="reel-dialog-copy"><span class="reel-handwritten">On remet les images ?</span><h2 id="reel-title"></h2><p>Le petit voyage commence ici. Et le souvenir continue dans le dossier.</p><a class="social-action dossier-action reel-dossier">Explorer le dossier ↗</a><p class="reel-help">Si Facebook ne lance pas la vidéo, <a class="reel-source" target="_blank" rel="noopener">ouvre le Reel sur Facebook</a>.</p></div></div>';
    document.body.append(dialog);
    dialog.querySelector('.reel-close').onclick=fermer;
    dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)fermer()}});
    dialog.addEventListener('close',()=>{frame?.remove();frame=null;document.documentElement.classList.remove('reel-open');origin?.focus({preventScroll:true})});
  }
  document.addEventListener('click',e=>{
    const link=e.target.closest('[data-reel]');
    if(!link||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;
    const id=link.dataset.reel;if(!/^\d+$/.test(id))return;
    if(typeof HTMLDialogElement==='undefined')return;
    e.preventDefault();if(!dialog)creer();origin=link;
    const title=link.dataset.reelTitle||'Le Reel RETOUR90';
    dialog.querySelector('#reel-title').textContent=title;
    dialog.querySelector('.reel-dossier').href=link.dataset.reelDossier;
    dialog.querySelector('.reel-source').href=link.href;
    // Ouvrir le Reel suspend le son du site, sans dépendre des cookies Facebook.
    REGIE.antenne('reel');
    frame?.remove();frame=document.createElement('iframe');
    const src=new URL('https://www.facebook.com/plugins/video.php');
    src.search=new URLSearchParams({href:'https://www.facebook.com/watch/?v='+id,show_text:'false',width:'360',height:'640',autoplay:'true',mute:'true'}).toString();
    frame.src=src.href;frame.title='Reel RETOUR90 : '+title;frame.width='360';frame.height='640';
    frame.allow='autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share; fullscreen';frame.allowFullscreen=true;
    document.documentElement.classList.add('reel-open');dialog.showModal();dialog.querySelector('.reel-stage').append(frame);
  });
}

/* Spotify reste un lecteur officiel : aucun compte ni jeton stocké par RETOUR90. */
function installerWalkmanSpotify(){
  const host=document.getElementById('wk');if(!host)return;
  const selections=[
    ['Hits français','37i9dQZF1DWXLbJb1PtkXq','Spotify'],
    ['Pop 90','37i9dQZF1DXbTxeAdrVG2l','Spotify'],
    ['Dance','2m500lwZqdPeyckQxt6N1g','Matt Stopera'],
    ['Rap français','31EvmajQ0BHXz6Ry4SfpbN','Daniel Milner'],
    ['Rock','37i9dQZF1DX1rVvRgjX59F','Spotify'],
    ['Hip-hop US','37i9dQZF1DX186v583rmzp','Spotify'],
    ['R&B','1kMyrcNKPws587cSAOjyDP','Nostalgic Vibes'],
    ['Britpop','37i9dQZF1DXaVgr4Tx5kRF','Spotify'],
    ['Slows','37i9dQZF1DWXqpDKK4ed9O','Spotify']
  ];
  const key='retour90.spotify.v1';let chosen=selections[0];
  try{const saved=JSON.parse(localStorage.getItem(key));if(saved&&/^[a-zA-Z0-9]{22}$/.test(saved[1]))chosen=selections.find(p=>p[1]===saved[1])||['Ta playlist',saved[1],'Spotify']}catch{}
  let api,controller,loading=false,ready=false,mode='clips',timeout;
  const clips=document.createElement('div');clips.className='wk-clips';
  host.querySelectorAll('.wk-screenwrap,.wk-k7s,.wk-ctl,.wk-foot').forEach(n=>clips.append(n));
  const body=document.createElement('div');body.className='wk-body';
  body.innerHTML='<figure class="wk-photo"><img src="assets/editorial/walkman-player-720.webp" alt="Baladeur Sony reconstitué, métal et cassette à fenêtre transparente" width="720" height="480"><figcaption>Ta bande-son n’a pas pris une ride.</figcaption></figure><div class="wk-sources" aria-label="Choisir le lecteur"><button type="button" data-source="clips" aria-pressed="true">FACE A · Les clips</button><button type="button" data-source="spotify" aria-pressed="false">FACE B · Spotify</button></div><section class="wk-spotify" aria-label="Playlists Spotify"><div class="wk-playlists" aria-label="Choisir une ambiance"></div><p class="wk-curator"></p><div class="wk-spotify-frame"><button type="button" class="wk-connect">Brancher Spotify ▶</button><p>Neuf ambiances. Des refrains par centaines.</p><div class="wk-spotify-mount"></div></div><p class="wk-spotify-status" role="status" aria-live="polite"></p><a class="wk-spotify-link" target="_blank" rel="noopener">Ouvrir cette playlist dans Spotify ↗</a><details class="wk-own"><summary>Tu as ta propre playlist ?</summary><form><label for="wk-playlist-url">Colle son lien Spotify</label><input id="wk-playlist-url" type="url" placeholder="https://open.spotify.com/playlist/…" required><button type="submit">Mettre dans le baladeur</button><p class="wk-url-error" role="status"></p></form></details><p class="wk-spotify-note">Lecture proposée par Spotify selon ton compte. Les sélections évoluent chez leurs créateurs.</p></section>';
  body.append(clips);host.append(body);host.classList.add('wk-real');
  const q=s=>body.querySelector(s),panel=q('.wk-spotify'),status=q('.wk-spotify-status');
  const genres=q('.wk-playlists');
  selections.forEach((p,i)=>{const b=document.createElement('button');b.type='button';b.textContent=p[0];b.dataset.playlist=p[1];b.style.setProperty('--tape-color',['#ffcaec','#ffe833','#59e4e5'][i%3]);b.onclick=()=>choose(p);genres.append(b)});
  function paint(){
    q('.wk-curator').textContent=chosen[0]+' · sélection '+chosen[2];
    q('.wk-spotify-link').href='https://open.spotify.com/playlist/'+chosen[1];
    genres.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.playlist===chosen[1])));
    document.getElementById('wknm').textContent=mode==='spotify'?'· '+chosen[0]:'· les clips';
  }
  function choose(p){chosen=p;try{localStorage.setItem(key,JSON.stringify(p))}catch{}paint();
    if(controller){controller.pause();controller.loadUri('spotify:playlist:'+p[1]);status.textContent='Appuie sur lecture dans Spotify.'}else connect();
  }
  function fail(){loading=false;status.textContent='Spotify ne répond pas ici. Le lien ci-dessous reste disponible.';q('.wk-connect').hidden=false}
  function create(){
    const mount=q('.wk-spotify-mount');
    api.createController(mount,{width:'100%',height:352,uri:'spotify:playlist:'+chosen[1]},c=>{
      controller=c;
      c.addListener('ready',()=>{clearTimeout(timeout);ready=true;loading=false;q('.wk-connect').hidden=true;q('.wk-spotify-frame>p').hidden=true;status.textContent='Appuie sur lecture dans Spotify.';if(mode!=='spotify')c.pause()});
      c.addListener('playback_started',()=>{REGIE.antenne('spotify');host.classList.add('spotify-playing');status.textContent='À l’écoute sur Spotify.'});
      c.addListener('playback_update',e=>{
        const playing=!e.data.isPaused&&!e.data.isBuffering;host.classList.toggle('spotify-playing',playing);
        if(playing){REGIE.antenne('spotify');status.textContent='À l’écoute sur Spotify.'}
      });
    });
  }
  function connect(){
    if(controller||loading)return;loading=true;status.textContent='On branche le baladeur…';q('.wk-connect').hidden=true;
    timeout=setTimeout(fail,15000);
    if(api){create();return}
    window.onSpotifyIframeApiReady=value=>{api=value;create()};
    const script=document.createElement('script');script.src='https://open.spotify.com/embed/iframe-api/v1';script.async=true;script.onerror=()=>{clearTimeout(timeout);fail();script.remove()};document.head.append(script);
  }
  function show(which){mode=which;const spotify=which==='spotify';
    panel.hidden=!spotify;clips.hidden=spotify;
    body.querySelectorAll('[data-source]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.source===which)));
    if(spotify)WK.pause();else controller?.pause();paint();paintTransport();
  }
  q('.wk-connect').onclick=connect;
  body.querySelectorAll('[data-source]').forEach(b=>b.onclick=()=>show(b.dataset.source));
  q('.wk-own form').onsubmit=e=>{e.preventDefault();const error=q('.wk-url-error');let id;
    try{const u=new URL(q('#wk-playlist-url').value);if(u.protocol==='https:'&&u.hostname==='open.spotify.com')id=u.pathname.match(/^\/(?:intl-[a-z]{2}\/)?playlist\/([a-zA-Z0-9]{22})\/?$/)?.[1]}catch{}
    if(!id){error.textContent='Il faut le lien d’une playlist sur open.spotify.com.';return}error.textContent='';choose(['Ta playlist',id,'Spotify']);
  };
  window.R90Spotify={pause(){try{controller?.pause()}catch{}host.classList.remove('spotify-playing')},showClips(){show('clips')}};
  const fold=document.getElementById('wkmin');
  const pause=document.createElement('button');pause.type='button';pause.className='wk-stop';
  function paintTransport(){
    if(mode==='spotify')document.getElementById('wknm').textContent='· '+chosen[0];
    const playing=host.classList.contains(mode==='spotify'?'spotify-playing':'playing');
    pause.textContent=playing?'Ⅱ':'▶';
    const label=playing?'Mettre la musique en pause':'Reprendre la musique';
    pause.setAttribute('aria-label',label);pause.title=label;
  }
  pause.onclick=e=>{
    e.stopPropagation();
    if(mode==='clips'){WK.toggle();return}
    if(!controller||!ready){WK.open();connect();return}
    if(host.classList.contains('spotify-playing')){controller.pause();status.textContent='Musique en pause.'}
    else controller.resume();
  };
  fold.before(pause);
  function folded(){const min=host.classList.contains('min');fold.textContent=min?'Ouvrir ▴':'Réduire ▾';fold.setAttribute('aria-expanded',String(!min));fold.setAttribute('aria-label',min?'Ouvrir le Walkman':'Replier le Walkman');}
  fold.addEventListener('click',folded);document.getElementById('wktop').addEventListener('click',folded);
  host.addEventListener('keydown',e=>{if(e.key==='Escape'&&!host.classList.contains('min')){e.stopPropagation();fold.click();fold.focus()}});
  new MutationObserver(()=>{folded();paintTransport()}).observe(host,{attributes:true,attributeFilter:['class']});
  paint();show('clips');folded();
}
