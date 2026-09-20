/* RETOUR90, une seule partie active, avec pause et nettoyage à la fermeture. */
(() => {
  'use strict';
  const q=(s,r=document)=>r.querySelector(s), qa=(s,r=document)=>[...r.querySelectorAll(s)];
  const COLORS=['#ff3598','#39dce9','#ffe83d','#a4eb69','#b899ff','#ff9a54'];
  const games=[
    {id:'snake',name:'Snake',cat:'reflexes',tag:'LE NOKIA DANS LA POCHE',desc:'Un serpent, un pixel à grignoter. Et plus de place pour tourner.',rules:'Attrape les carrés jaunes. Ton serpent grandit à chaque bouchée. Les bords te ramènent de l’autre côté ; évite ton propre corps.',keys:['Flèches du clavier ou boutons directionnels.','Sur écran tactile, glisse dans la direction voulue.'],goal:10,unit:'points',make:snake},
    {id:'bricks',name:'Casse-briques',cat:'reflexes',tag:'LA BORNE DU CAMPING',desc:'Trois vies. Un mur de couleurs. Ne laisse rien debout.',rules:'Renvoie la balle avec la raquette. Chaque brique vaut 10 points. Vide les cinq rangées avec tes trois vies.',keys:['Déplace la souris ou ton doigt sur le jeu.','Au clavier : flèches gauche et droite.'],goal:200,unit:'points',make:bricks},
    {id:'inv',name:'Invasion',cat:'reflexes',tag:'DÉFENSE DE LA GALAXIE',desc:'Ils descendent. Tu résistes. Une vague, puis une autre.',rules:'Détruis les envahisseurs avant qu’ils atteignent ton vaisseau. Chaque cible vaut 20 points. Les vagues accélèrent.',keys:['Flèches gauche et droite pour te déplacer.','Espace ou bouton FEU pour tirer.'],goal:500,unit:'points',make:invasion},
    {id:'pong',name:'Pong',cat:'reflexes',tag:'LE DUEL INDÉMODABLE',desc:'Le classique d’avant les 90’s qui ne quittait jamais la salle.',rules:'Renvoie la balle derrière la raquette adverse. La première raquette à cinq points remporte le duel.',keys:['Déplace la souris ou ton doigt de haut en bas.','Au clavier : flèches haut et bas.'],goal:5,unit:'points',make:pong},
    {id:'simon',name:'Simon',cat:'memoire',tag:'LES QUATRE COULEURS',desc:'Regarde. Écoute. Répète. Puis une couleur de plus.',rules:'Mémorise la séquence, puis reproduis-la dans le même ordre. Chaque tour réussi ajoute une couleur. Les numéros permettent aussi de jouer sans son.',keys:['Clique les touches colorées ou utilise 1, 2, 3, 4.','Attends le message « À toi » avant de répondre.'],goal:8,unit:'niveaux',make:simon},
    {id:'mines',name:'Démineur',cat:'memoire',tag:'LA SALLE INFORMATIQUE',desc:'Une grille, dix mines. Et ce petit doute avant le clic.',rules:'Ouvre les 71 cases sans mine. Chaque chiffre indique les mines voisines. La première case ouverte est toujours sûre.',keys:['Clique une case pour l’ouvrir.','Active « Drapeaux » ou fais un clic droit pour marquer une mine.'],goal:1,unit:'victoire',make:mines},
    {id:'memory',name:'Memory 90',cat:'memoire',tag:'LES PAIRES DE LA RÉCRÉ',desc:'Retrouve huit paires d’objets cultes en un minimum de coups.',rules:'Retourne deux cartes. Si elles correspondent, la paire reste visible. Retrouve les huit paires ; chaque coup supplémentaire réduit le score final.',keys:['Clique ou touche deux cartes.','Au clavier : Tab puis Entrée pour retourner une carte.'],goal:700,unit:'points',fresh:true,make:memory},
    {id:'reflex',name:'Réflexe néon',cat:'reflexes',tag:'30 SECONDES POUR BRILLER',desc:'La touche s’allume. À toi d’être plus rapide qu’elle.',rules:'Touche uniquement la cible jaune avant qu’elle s’éteigne. Une bonne cible vaut 10 points, une mauvaise retire 5 points. Tu as 30 secondes.',keys:['Clique la touche jaune ou touche-la du doigt.','Les touches 1 à 9 correspondent à la grille.'],goal:200,unit:'points',fresh:true,make:reflex},
    {id:'tama',name:'Tamagotchi',cat:'detente',tag:'TON COPAIN DE POCHE',desc:'Il a faim. Il veut jouer. Et il compte toujours sur toi.',rules:'Nourris ton petit compagnon, joue avec lui et laisse-le se reposer. Ses besoins évoluent avec le temps, même quand tu quittes le site. Toutes les six attentions, il grandit.',keys:['Utilise les trois boutons sous ton compagnon.','Son état reste conservé dans ce navigateur.'],goal:3,unit:'niveaux',make:tama},
    {id:'quiz',name:'Le grand quiz',cat:'memoire',tag:'PROUVE QUE TU Y ÉTAIS',desc:'Huit questions. Des souvenirs. Aucun contrôle surprise.',rules:'Huit questions sont tirées au sort à chaque partie. Choisis une réponse et découvre la bonne avant de continuer.',keys:['Clique une réponse ou utilise les touches 1 à 4.','Le bouton « Question suivante » te laisse le temps de lire.'],goal:8,unit:'bonnes réponses',make:quiz}
  ];
  let dialog,session=null,origin=null,sound=true;
  const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}};
  const write=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value))}catch{}};
  const high=g=>Number(S.hi[g.id])||0;
  const units=(g,n)=>n===1?({points:'point',niveaux:'niveau','bonnes réponses':'bonne réponse'}[g.unit]||g.unit):g.unit==='victoire'?'victoires':g.unit;
  const shuffle=a=>{const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b};
  function record(g,value){if(value>high(g)){S.hi[g.id]=value;save()}q('#game-record').textContent='RECORD '+high(g);updateRecords()}
  function updateRecords(){
    const results=games.filter(g=>high(g)>0&&g.id!=='tama');
    q('#arcade-records').innerHTML=results.length?'<ol>'+results.map(g=>`<li><span>${g.name}</span><strong>${high(g)} ${units(g,high(g))}</strong></li>`).join('')+'</ol>':'<p>Aucun record pour le moment. La prochaine ligne pourrait être la tienne.</p>';
    games.forEach(g=>{const el=q('[data-record="'+g.id+'"]');if(el)el.textContent=high(g)?'Record '+high(g):'À toi de jouer'});
  }
  function init(){
    dialog=q('#arcade-dialog');if(!dialog)return;
    sound=read('retour90.arcade.sound',true);paintSound();
    q('#arcade-catalogue').innerHTML=games.map((g,i)=>`<article class="arcade-game" data-category="${g.cat}" style="--accent:${COLORS[i%COLORS.length]}"><div class="arcade-game-head"><span>BORNE ${String(i+1).padStart(2,'0')}</span><span class="game-badge">${g.fresh?'NOUVEAU':g.tag}</span></div><canvas class="arcade-card-art" width="480" height="230" data-preview="${g.id}" aria-label="Aperçu du jeu ${g.name}" role="img"></canvas><div class="arcade-game-copy"><h3>${g.name}</h3><p>${g.desc}</p><div class="arcade-game-bottom"><button type="button" class="arc-btn" data-open-game="${g.id}" aria-label="Jouer à ${g.name}" aria-haspopup="dialog">Jouer <span aria-hidden="true">↗</span></button><small data-record="${g.id}"></small></div></div></article>`).join('');
    qa('[data-preview]').forEach(cv=>preview(cv,cv.dataset.preview));
    qa('[data-open-game]').forEach(b=>b.addEventListener('click',()=>openGame(b.dataset.openGame,b)));
    qa('[data-filter]').forEach(b=>b.addEventListener('click',()=>{
      qa('[data-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
      let n=0;qa('.arcade-game').forEach(card=>{card.hidden=b.dataset.filter!=='all'&&b.dataset.filter!==card.dataset.category;if(!card.hidden)n++});
      q('#arcade-count').textContent=n+' jeux disponibles';
    }));
    const date=new Date(),day=Math.floor(Date.UTC(date.getFullYear(),date.getMonth(),date.getDate())/86400000);
    const daily=games.filter(g=>g.id!=='tama')[day%9];
    q('#daily-title').textContent=daily.name+' : tu fais mieux ?';
    q('#daily-description').textContent='Le défi : atteindre '+daily.goal+' '+daily.unit+'. Une partie suffit pour tenter ta chance. Demain, une autre borne.';
    q('#daily-play').onclick=()=>openGame(daily.id,q('#daily-play'));
    q('#game-close').onclick=()=>dialog.close();
    dialog.addEventListener('close',()=>{session?.destroy();session=null;document.documentElement.classList.remove('arcade-open');dialog.classList.remove('is-maximized');q('#game-fullscreen').textContent='Agrandir';origin?.focus();updateRecords()});
    dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()});
    q('#game-toggle').onclick=()=>session?.toggle();
    q('#game-restart').onclick=()=>{if(session)mount(session.game)};
    q('#game-sound').onclick=()=>{sound=!sound;write('retour90.arcade.sound',sound);paintSound()};
    q('#game-fullscreen').onclick=()=>{const big=dialog.classList.toggle('is-maximized');q('#game-fullscreen').textContent=big?'Réduire':'Agrandir';dialog.scrollTop=0};
    document.addEventListener('visibilitychange',()=>{if(document.hidden)session?.pause()});
    window.addEventListener('blur',()=>session?.pause());
    updateRecords();
  }
  function paintSound(){const b=q('#game-sound');b.textContent=sound?'Son activé':'Son coupé';b.setAttribute('aria-pressed',String(sound))}
  function openGame(id,button){const g=games.find(g=>g.id===id);if(!g)return;origin=button;q('#game-title').textContent=g.name;q('#game-number').textContent='BORNE '+String(games.indexOf(g)+1).padStart(2,'0')+' · RETOUR90';q('#game-description').textContent=g.rules;q('#game-help').innerHTML='<ul>'+g.keys.map(k=>'<li>'+k+'</li>').join('')+'</ul>';if(!dialog.open)dialog.showModal();document.documentElement.classList.add('arcade-open');mount(g);dialog.scrollTop=0;q('#game-toggle').focus({preventScroll:true})}
  function mount(game){
    session?.destroy();const stage=q('#game-stage');stage.replaceChildren();q('#game-score').textContent='';
    let state='ready',clock=0,last=0,acc=0,raf=0,engine={},alive=true,resumeMessage='À toi de jouer.';
    const abort=new AbortController(),keys=new Set(),jobs=[];
    const status=text=>{q('#game-status').textContent=text};
    function paint(){stage.dataset.state=state;q('#game-toggle').textContent=state==='running'?'Pause':state==='paused'?'Reprendre':state==='ended'?'Rejouer':'Jouer';q('#game-toggle').setAttribute('aria-label',state==='running'?'Mettre la partie en pause':state==='paused'?'Reprendre la partie':state==='ended'?'Rejouer à '+game.name:'Démarrer '+game.name);q('#game-restart').disabled=state==='ready'}
    const ctx={game,stage,keys,on(target,type,fn,opts={}){target.addEventListener(type,fn,{...opts,signal:abort.signal})},get running(){return state==='running'},get time(){return clock},status,score(value,extra=''){q('#game-score').textContent='SCORE '+value+(extra?' · '+extra:'')},sound(f=660,d=.06){if(sound&&state==='running')blip(f,d,'triangle',.035)},later(fn,delay){jobs.push({at:clock+delay,fn})},record(value){record(game,value)},finish(text,value){if(state==='ended')return;record(game,value);state='ended';keys.clear();status(text+' · Score '+value);paint()},canvas(w=480,h=360){const c=document.createElement('canvas');c.width=w;c.height=h;c.setAttribute('role','img');c.setAttribute('aria-label','Zone de jeu '+game.name+'. Commandes décrites à côté.');stage.append(c);return [c,c.getContext('2d')]},controls(items){const bar=document.createElement('div');bar.className='arcade-pad';bar.innerHTML=items.map(([key,text])=>`<button type="button" data-key="${key}" aria-label="${text}">${text}</button>`).join('');stage.append(bar);qa('button',bar).forEach(b=>{ctx.on(b,'pointerdown',e=>{e.preventDefault();b.setPointerCapture?.(e.pointerId);if(ctx.running){keys.add(b.dataset.key);engine.key?.(b.dataset.key)}});['pointerup','pointercancel','lostpointercapture'].forEach(event=>ctx.on(b,event,()=>keys.delete(b.dataset.key)));ctx.on(b,'click',e=>{if(e.detail===0&&ctx.running){keys.add(b.dataset.key);engine.key?.(b.dataset.key);ctx.later(()=>keys.delete(b.dataset.key),130)}})});return bar}};
    session={game,toggle(){if(state==='ended'){mount(game);session.toggle();return}if(state==='running'){this.pause();return}REGIE.antenne('arcade');const resumed=state==='paused';state='running';last=0;acc=0;status(resumed?resumeMessage:'À toi de jouer.');engine.start?.();paint();engine.draw?.();dialog.scrollTop=0},pause(){if(state!=='running')return;resumeMessage=q('#game-status').textContent;state='paused';keys.clear();status('Partie en pause. Reprends quand tu veux.');paint()},destroy(){alive=false;cancelAnimationFrame(raf);abort.abort();keys.clear();engine.destroy?.();jobs.length=0}};
    engine=game.make(ctx)||{};
    ctx.on(dialog,'keydown',e=>{if(!ctx.running||e.target.tagName==='INPUT')return;if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' ','1','2','3','4','5','6','7','8','9'].includes(e.key)){e.preventDefault();if(!keys.has(e.key))engine.key?.(e.key);keys.add(e.key)}});
    ctx.on(dialog,'keyup',e=>keys.delete(e.key));
    function frame(now){if(!alive)return;if(!last)last=now;const delta=Math.min(50,now-last);last=now;if(ctx.running){acc+=delta;while(acc>=1000/60&&ctx.running){clock+=1000/60;engine.tick?.(1000/60);for(let i=jobs.length-1;i>=0;i--){if(jobs[i].at<=clock){const job=jobs.splice(i,1)[0];job.fn()}}acc-=1000/60}engine.draw?.()}raf=requestAnimationFrame(frame)}
    if(!q('#game-score').textContent)ctx.score(0);q('#game-record').textContent='RECORD '+high(game);status('Prêt ? Les commandes sont juste à côté.');paint();engine.draw?.();raf=requestAnimationFrame(frame);
  }
  function field(x,w,h){x.fillStyle='#080e19';x.fillRect(0,0,w,h);x.strokeStyle='#182337';x.lineWidth=1;for(let yy=0;yy<h;yy+=24){x.beginPath();x.moveTo(0,yy+.5);x.lineTo(w,yy+.5);x.stroke()}}
  function pointer(ctx,cv,fn){const point=e=>{if(!ctx.running)return;const r=cv.getBoundingClientRect();fn((e.clientX-r.left)*cv.width/r.width,(e.clientY-r.top)*cv.height/r.height)};ctx.on(cv,'pointerdown',e=>{cv.setPointerCapture(e.pointerId);point(e)});ctx.on(cv,'pointermove',point)}
  function snake(ctx){
    const [cv,x]=ctx.canvas(400,400),n=20,cell=20;let body=[{x:9,y:10},{x:8,y:10},{x:7,y:10}],dir={x:1,y:0},next=dir,food={x:14,y:10},sc=0,elapsed=0;
    ctx.controls([['ArrowUp','Haut'],['ArrowLeft','Gauche'],['ArrowDown','Bas'],['ArrowRight','Droite']]);
    const turn=key=>{const v={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0]}[key];if(v&&(v[0]!==-dir.x||v[1]!==-dir.y))next={x:v[0],y:v[1]}};
    let touch;ctx.on(cv,'pointerdown',e=>{touch=[e.clientX,e.clientY]});ctx.on(cv,'pointerup',e=>{if(!touch||!ctx.running)return;const dx=e.clientX-touch[0],dy=e.clientY-touch[1];if(Math.max(Math.abs(dx),Math.abs(dy))>10)turn(Math.abs(dx)>Math.abs(dy)?dx>0?'ArrowRight':'ArrowLeft':dy>0?'ArrowDown':'ArrowUp');touch=null});
    return {key:turn,tick(dt){elapsed+=dt;if(elapsed<Math.max(75,150-sc*2))return;elapsed=0;dir=next;const head={x:(body[0].x+dir.x+n)%n,y:(body[0].y+dir.y+n)%n},eat=head.x===food.x&&head.y===food.y;if(body.slice(0,eat?body.length:-1).some(b=>b.x===head.x&&b.y===head.y)){ctx.finish('Le serpent s’est mordu la queue !',sc);return}body.unshift(head);if(eat){sc++;ctx.record(sc);ctx.sound(820);if(body.length===n*n){ctx.finish('Toute la grille est à toi !',sc);return}do{food={x:Math.floor(Math.random()*n),y:Math.floor(Math.random()*n)}}while(body.some(b=>b.x===food.x&&b.y===food.y))}else body.pop();ctx.score(sc)},draw(){field(x,400,400);x.fillStyle='#ffe83d';x.fillRect(food.x*cell+4,food.y*cell+4,12,12);body.forEach((b,i)=>{x.fillStyle=i?'#a2ee71':'#35dbe9';x.fillRect(b.x*cell+1,b.y*cell+1,18,18)});x.fillStyle='#080e19';x.fillRect(body[0].x*cell+12,body[0].y*cell+4,3,3)}};
  }
  function pong(ctx){
    const [cv,x]=ctx.canvas(480,340);let py=125,ay=125,bx=240,by=170,vx=3.5,vy=2,ps=0,ai=0;
    const serve=d=>{bx=240;by=170;vx=3.5*d;vy=(Math.random()*3-1.5)||1};pointer(ctx,cv,(_,y)=>py=Math.max(0,Math.min(264,y-38)));ctx.controls([['ArrowUp','Haut'],['ArrowDown','Bas']]);
    return {tick(){if(ctx.keys.has('ArrowUp'))py=Math.max(0,py-5);if(ctx.keys.has('ArrowDown'))py=Math.min(264,py+5);ay=Math.max(0,Math.min(264,ay+Math.max(-2.7,Math.min(2.7,(by-ay-38)*.07))));bx+=vx;by+=vy;if(by<5||by>335)vy*=-1;if(bx<23&&bx>12&&by>py&&by<py+76&&vx<0){vx=Math.min(7,Math.abs(vx)*1.05);vy+=(by-py-38)*.025;ctx.sound(620)}if(bx>457&&bx<470&&by>ay&&by<ay+76&&vx>0){vx=-Math.min(7,Math.abs(vx)*1.05);ctx.sound(440)}if(bx<0){ai++;serve(1)}if(bx>480){ps++;ctx.record(ps);serve(-1)}ctx.score(ps,'ADVERSAIRE '+ai);if(ps>=5||ai>=5)ctx.finish(ps>=5?'Duel remporté !':'La revanche t’attend.',ps)},draw(){field(x,480,340);x.strokeStyle='#728299';x.setLineDash([6,10]);x.beginPath();x.moveTo(240,0);x.lineTo(240,340);x.stroke();x.setLineDash([]);x.fillStyle='#39dce9';x.fillRect(12,py,8,76);x.fillStyle='#ff3598';x.fillRect(460,ay,8,76);x.fillStyle='#ffe83d';x.fillRect(bx-5,by-5,10,10)}};
  }
  function bricks(ctx){
    const [cv,x]=ctx.canvas(480,360);let px=240,bx=240,by=285,vx=3,vy=-3.3,sc=0,lives=3,wait=0;
    const blocks=[];for(let r=0;r<5;r++)for(let c=0;c<10;c++)blocks.push({x:10+c*46,y:25+r*22,r});
    pointer(ctx,cv,(xx)=>px=Math.max(42,Math.min(438,xx)));ctx.controls([['ArrowLeft','Gauche'],['ArrowRight','Droite']]);
    return {tick(dt){if(ctx.keys.has('ArrowLeft'))px=Math.max(42,px-6);if(ctx.keys.has('ArrowRight'))px=Math.min(438,px+6);if(wait>0){wait-=dt;return}bx+=vx;by+=vy;if(bx<5||bx>475)vx*=-1;if(by<5)vy=Math.abs(vy);if(by>=330&&by<=345&&bx>px-45&&bx<px+45&&vy>0){vy=-Math.abs(vy);vx=Math.max(-5,Math.min(5,(bx-px)*.09));ctx.sound(650)}if(by>365){lives--;if(!lives){ctx.finish('Plus de vies. Une autre partie ?',sc);return}bx=px;by=285;vx=3;vy=-3.3;wait=700;ctx.status('Encore '+lives+' vies. La balle repart.')}for(let i=blocks.length-1;i>=0;i--){const b=blocks[i];if(bx>b.x-5&&bx<b.x+47&&by>b.y-5&&by<b.y+22){blocks.splice(i,1);vy*=-1;sc+=10;ctx.record(sc);ctx.sound(760+b.r*70);break}}ctx.score(sc,'VIES '+lives);if(!blocks.length)ctx.finish('Mur nettoyé. Bien joué !',sc)},draw(){field(x,480,360);blocks.forEach(b=>{x.fillStyle=COLORS[b.r];x.fillRect(b.x,b.y,42,17);x.fillStyle='#ffffff45';x.fillRect(b.x,b.y,42,3)});x.fillStyle='#f8f1db';x.fillRect(px-42,337,84,8);x.fillStyle='#ffe83d';x.beginPath();x.arc(bx,by,5,0,Math.PI*2);x.fill()}};
  }
  function invasion(ctx){
    const [cv,x]=ctx.canvas(480,360);let px=240,shots=[],aliens=[],offset=0,drop=0,velocity=.6,sc=0,wave=1,cool=0;
    function spawn(){aliens=[];for(let r=0;r<3;r++)for(let c=0;c<8;c++)aliens.push({x:30+c*47,y:30+r*30,r});offset=0;drop=0;velocity=.5+wave*.12}spawn();ctx.controls([['ArrowLeft','Gauche'],[' ','FEU'],['ArrowRight','Droite']]);
    return {tick(){if(ctx.keys.has('ArrowLeft'))px=Math.max(15,px-4);if(ctx.keys.has('ArrowRight'))px=Math.min(465,px+4);if(ctx.keys.has(' ')&&cool<=0){shots.push({x:px,y:324});cool=15;ctx.sound(920,.03)}cool--;offset+=velocity;if(aliens.length&&(Math.max(...aliens.map(a=>a.x+offset))>450||Math.min(...aliens.map(a=>a.x+offset))<5)){velocity*=-1;drop+=12;offset+=velocity}shots=shots.filter(s=>{s.y-=6;const i=aliens.findIndex(a=>Math.abs(s.x-(a.x+offset+12))<16&&s.y>a.y+drop-4&&s.y<a.y+drop+20);if(i>=0){aliens.splice(i,1);sc+=20;ctx.record(sc);ctx.sound(460,.04);return false}return s.y>0});if(!aliens.length){wave++;spawn();ctx.status('Vague '+wave+' : ils reviennent !')}if(aliens.some(a=>a.y+drop>=307)){ctx.finish('Les envahisseurs ont atteint la base.',sc);return}ctx.score(sc,'VAGUE '+wave)},draw(){field(x,480,360);aliens.forEach(a=>{const xx=a.x+offset,yy=a.y+drop;x.fillStyle=COLORS[(a.r+wave)%6];x.fillRect(xx+4,yy,16,4);x.fillRect(xx,yy+4,24,12);x.fillRect(xx+2,yy+16,4,4);x.fillRect(xx+18,yy+16,4,4);x.fillStyle='#08101c';x.fillRect(xx+5,yy+7,4,4);x.fillRect(xx+15,yy+7,4,4)});x.fillStyle='#39dce9';x.fillRect(px-15,335,30,9);x.fillRect(px-4,326,8,9);x.fillStyle='#ffe83d';shots.forEach(s=>x.fillRect(s.x-2,s.y,4,9))}};
  }
  function simon(ctx){
    ctx.stage.innerHTML='<div class="simon-board">'+COLORS.slice(0,4).map((c,i)=>`<button type="button" style="--pad:${c}" aria-label="${['Rose','Cyan','Jaune','Vert'][i]}, touche ${i+1}">${i+1}</button>`).join('')+'</div>';
    const pads=qa('button',ctx.stage);let seq=[],pos=0,locked=true,started=false,level=0;
    function flash(i,d=340){pads[i].classList.add('lit');ctx.sound([330,415,494,622][i],.14);ctx.later(()=>pads[i].classList.remove('lit'),d)}
    function grow(){seq.push(Math.floor(Math.random()*4));pos=0;locked=true;ctx.status('Regarde la séquence…');seq.forEach((v,i)=>ctx.later(()=>flash(v),400+i*550));ctx.later(()=>{locked=false;ctx.status('À toi : '+seq.length+' touche'+(seq.length>1?'s':'')+' à répéter.')},seq.length*550+400)}
    function choose(i){if(!ctx.running||locked)return;flash(i,180);if(seq[pos]!==i){ctx.finish('Cette fois, la mémoire a glissé.',level);return}pos++;if(pos===seq.length){locked=true;level++;ctx.record(level);ctx.score(level,'NIVEAUX');ctx.status('Bien vu ! La séquence s’allonge.');ctx.later(grow,850)}}
    pads.forEach((b,i)=>ctx.on(b,'click',()=>choose(i)));
    return {start(){if(!started){started=true;grow()}},key(k){if(/^[1-4]$/.test(k))choose(+k-1)}};
  }
  function mines(ctx){
    let grid=Array(81).fill(0),opened=new Set(),flags=new Set(),placed=false,flagMode=false,done=false;
    ctx.stage.innerHTML='<div class="mine-board"></div><div class="arcade-pad"><button type="button" id="mine-mode" aria-pressed="false">Drapeaux : non</button></div>';
    const board=q('.mine-board',ctx.stage),flagBtn=q('#mine-mode',ctx.stage);
    const around=i=>{const a=[];for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const row=Math.floor(i/9)+dy,col=i%9+dx;if((dx||dy)&&row>=0&&row<9&&col>=0&&col<9)a.push(row*9+col)}return a};
    function place(first){let n=0;const safe=new Set([first,...around(first)]);while(n<10){const i=Math.floor(Math.random()*81);if(!safe.has(i)&&grid[i]!==-1){grid[i]=-1;n++}}grid=grid.map((v,i)=>v===-1?v:around(i).filter(j=>grid[j]===-1).length);placed=true}
    function draw(){board.innerHTML=grid.map((v,i)=>`<button type="button" data-cell="${i}" class="${opened.has(i)?'open':''} ${done&&v===-1?'boom':''}" aria-label="Ligne ${Math.floor(i/9)+1}, colonne ${i%9+1} : ${done&&v===-1?'mine':flags.has(i)?'drapeau':opened.has(i)?v+' mines voisines':'case fermée'}">${done&&v===-1?'×':flags.has(i)?'⚑':opened.has(i)&&v?v:''}</button>`).join('');ctx.score(opened.size,'DRAPEAUX '+flags.size+'/10')}
    function choose(i,flag){if(!ctx.running||done||opened.has(i))return;if(flag){if(flags.has(i))flags.delete(i);else if(flags.size<10)flags.add(i);draw();return}if(flags.has(i))return;if(!placed)place(i);if(grid[i]===-1){done=true;draw();ctx.finish('Une mine ! Les cases sûres t’attendent à la prochaine partie.',0);return}const pending=[i];while(pending.length){const j=pending.pop();if(opened.has(j)||flags.has(j))continue;opened.add(j);if(grid[j]===0)around(j).forEach(k=>{if(!opened.has(k)&&grid[k]!==-1)pending.push(k)})}draw();ctx.sound(680,.035);if(opened.size===71){done=true;ctx.finish('Terrain déminé ! Une victoire de plus.',high(ctx.game)+1)}}
    ctx.on(board,'click',e=>{const b=e.target.closest('[data-cell]');if(b)choose(+b.dataset.cell,flagMode)});ctx.on(board,'contextmenu',e=>{e.preventDefault();const b=e.target.closest('[data-cell]');if(b)choose(+b.dataset.cell,true)});ctx.on(flagBtn,'click',()=>{flagMode=!flagMode;flagBtn.textContent='Drapeaux : '+(flagMode?'oui':'non');flagBtn.setAttribute('aria-pressed',String(flagMode))});draw();return {};
  }
  const pairs=[['game-boy','Game Boy'],['le-walkman','Walkman'],['tamagotchi','Tamagotchi'],['les-billes','Billes'],['les-pogs','POGS'],['la-k7-et-le-doigt-sur-rec','Cassette'],['le-yo-yo-a-roulement','Yo-yo'],['la-disquette-3-5','Disquette']];
  function memory(ctx){
    const deck=shuffle([...pairs,...pairs]);let first=null,locked=false,moves=0,count=0;const matched=new Set();
    ctx.stage.innerHTML='<div class="memory-board">'+deck.map((p,i)=>`<button type="button" data-card="${i}" aria-label="Carte ${i+1}, face cachée"><img src="assets/editorial/${p[0]}-720.webp" alt=""><span>${String(i+1).padStart(2,'0')}</span></button>`).join('')+'</div>';
    const buttons=qa('[data-card]',ctx.stage);
    buttons.forEach((b,i)=>ctx.on(b,'click',()=>{if(!ctx.running||locked||matched.has(i)||first===i)return;b.classList.add('revealed');b.setAttribute('aria-label','Carte '+(i+1)+' : '+deck[i][1]);ctx.sound(630);if(first===null){first=i;return}moves++;const a=first;first=null;if(deck[a][0]===deck[i][0]){matched.add(a);matched.add(i);buttons[a].classList.add('matched');b.classList.add('matched');count++;ctx.status(count+' paires sur 8.');ctx.score(count,'COUPS '+moves);if(count===8)ctx.finish('Les huit paires sont retrouvées en '+moves+' coups !',Math.max(100,1000-(moves-8)*25))}else{locked=true;ctx.score(count,'COUPS '+moves);ctx.later(()=>{[a,i].forEach(j=>{buttons[j].classList.remove('revealed');buttons[j].setAttribute('aria-label','Carte '+(j+1)+', face cachée')});locked=false},1000)}}));return {};
  }
  function reflex(ctx){
    ctx.stage.innerHTML='<div class="reflex-board">'+Array.from({length:9},(_,i)=>`<button type="button" data-target="${i}" aria-label="Touche ${i+1}">${i+1}</button>`).join('')+'</div>';
    const buttons=qa('button',ctx.stage);let target=-1,sc=0,until=0,lastSecond=-1;
    function next(){buttons.forEach(b=>b.classList.remove('target'));let n;do{n=Math.floor(Math.random()*9)}while(n===target);target=n;buttons[n].classList.add('target');buttons.forEach((b,i)=>b.setAttribute('aria-label','Touche '+(i+1)+(i===target?', cible allumée':'')));until=ctx.time+950}
    function choose(i){if(!ctx.running)return;if(i===target){sc+=10;ctx.sound(860);next()}else{sc=Math.max(0,sc-5);ctx.sound(200)}ctx.score(sc,'RESTE '+Math.max(0,30-Math.floor(ctx.time/1000))+' S')}
    buttons.forEach((b,i)=>ctx.on(b,'click',()=>choose(i)));
    return {start(){if(target<0)next()},key(k){if(/^[1-9]$/.test(k))choose(+k-1)},tick(){if(ctx.time>=30000){buttons.forEach(b=>b.classList.remove('target'));ctx.finish('Trente secondes écoulées !',sc);return}if(ctx.time>=until)next();const s=30-Math.floor(ctx.time/1000);if(s!==lastSecond){ctx.score(sc,'RESTE '+s+' S');lastSecond=s}}};
  }
  function tama(ctx){
    if(!S.tama)S.tama={f:100,j:100,n:1,x:0,t:Date.now(),born:Date.now()};const pet=S.tama;
    ctx.stage.innerHTML='<div class="arcade-pet"><img src="assets/editorial/tamagotchi-720.webp" alt="Tamagotchi rose, scène reconstituée"><div class="arcade-pet-face" aria-label="Humeur du compagnon"></div><div class="pet-meters"><label>Satiété <meter id="pet-food" min="0" max="100"></meter></label><label>Joie <meter id="pet-joy" min="0" max="100"></meter></label></div><div class="arcade-pad"><button type="button" data-pet="eat">Nourrir</button><button type="button" data-pet="play">Jouer</button><button type="button" data-pet="sleep">Dodo</button></div></div>';
    let since=0;function draw(){const hours=(Date.now()-pet.t)/3600000;pet.f=Math.max(0,pet.f-hours*9);pet.j=Math.max(0,pet.j-hours*7);pet.t=Date.now();q('.arcade-pet-face',ctx.stage).textContent=pet.f<20||pet.j<20?'(╥﹏╥)':pet.f<50||pet.j<50?'(・_・)':'(•ᴗ•)';q('#pet-food',ctx.stage).value=pet.f;q('#pet-joy',ctx.stage).value=pet.j;ctx.score(pet.n,'NIVEAU · '+Math.floor((Date.now()-pet.born)/86400000)+' JOURS');save()}
    qa('[data-pet]',ctx.stage).forEach(b=>ctx.on(b,'click',()=>{if(!ctx.running)return;if(b.dataset.pet==='eat')pet.f=Math.min(100,pet.f+22);else if(b.dataset.pet==='play')pet.j=Math.min(100,pet.j+20);else{pet.f=Math.min(100,pet.f+8);pet.j=Math.min(100,pet.j+8)}pet.x++;if(pet.x%6===0){pet.n++;ctx.record(pet.n);ctx.status('Il grandit ! Niveau '+pet.n+'.')}else ctx.status(b.dataset.pet==='eat'?'Il se régale.':b.dataset.pet==='play'?'Encore une partie avec toi !':'Une petite sieste, ça fait du bien.');ctx.sound(720);draw()}));draw();return {start:draw,tick(dt){since+=dt;if(since>20000){since=0;draw()}},destroy(){save()}};
  }
  const questions=[
    ['La première Coupe du monde remportée par la France ?',['1994','1996','1998','2000'],2],
    ['Dans un Carambar, on trouvait aussi…',['Un autocollant','Une blague','Un jeton','Un code'],1],
    ['Quel petit appareil demandait à être nourri ?',['Le Game Boy','Le Walkman','Le Tamagotchi','Le Bi-Bop'],2],
    ['Sur quelle console Sonic fait-il ses débuts ?',['Super Nintendo','Mega Drive','PlayStation','Game Boy'],1],
    ['Avant de rendre une VHS au vidéo-club, il fallait…',['La nettoyer','La rembobiner','La recopier','La retourner'],1],
    ['Quel terminal permettait de consulter le 3615 ?',['Le Minitel','Le Bi-Bop','Le Tatoo','Le fax'],0],
    ['Quel jeu associait-on au Nokia 3210 ?',['Pong','Solitaire','Snake','Démineur'],2],
    ['Quelle émission jeunesse s’arrête en 1997 ?',['Les Minikeums','Le Club Dorothée','Ça Cartoon','Graine de Star'],1],
    ['Que se collait-on sur le bras avec un Malabar ?',['Une vignette Panini','Un tatouage','Un POG','Une gommette'],1],
    ['Quel film de 1993 fait trembler un verre d’eau ?',['Titanic','Jurassic Park','Matrix','Terminator 2'],1],
    ['Comment s’appelle la console portable de Nintendo sortie en 1989 au Japon ?',['Game Gear','Game Boy','PSP','Dreamcast'],1],
    ['Quelle cassette utilisait-on dans un magnétoscope de salon ?',['Une K7 audio','Une VHS','Une disquette','Un MiniDisc'],1],
    ['Dans Pokémon, de quelle couleur est Pikachu ?',['Bleu','Rouge','Jaune','Vert'],2],
    ['Pour enregistrer sa chanson à la radio, on appuyait sur…',['EJECT','REC','REW','STOP'],1]
  ];
  function quiz(ctx){
    const set=shuffle(questions).slice(0,8);let index=0,score=0,answered=false;
    function draw(){const question=set[index];ctx.stage.innerHTML='<div class="arcade-quiz"><span class="arc-kicker">QUESTION '+(index+1)+' / 8</span><h3>'+question[0]+'</h3>'+question[1].map((a,i)=>`<button type="button" data-answer="${i}">${i+1}. ${a}</button>`).join('')+'<button type="button" id="quiz-next" hidden>Question suivante →</button></div>';ctx.score(score,'QUESTION '+(index+1)+'/8')}
    function choose(i){if(!ctx.running||answered)return;answered=true;const answer=set[index][2];qa('[data-answer]',ctx.stage).forEach(b=>{b.disabled=true;if(+b.dataset.answer===answer)b.classList.add('good');else if(+b.dataset.answer===i)b.classList.add('bad')});if(i===answer){score++;ctx.sound(880);ctx.status('Bonne réponse !')}else{ctx.sound(220);ctx.status('La bonne réponse : '+set[index][1][answer]+'.')}ctx.score(score,'QUESTION '+(index+1)+'/8');q('#quiz-next',ctx.stage).hidden=false;q('#quiz-next',ctx.stage).textContent=index===7?'Voir mon résultat →':'Question suivante →';q('#quiz-next',ctx.stage).focus()}
    ctx.on(ctx.stage,'click',e=>{const b=e.target.closest('[data-answer]');if(b)choose(+b.dataset.answer);if(e.target.id==='quiz-next'&&ctx.running){index++;if(index===8){ctx.finish(score>=7?'Tu connais tes classiques !':'Un souvenir de plus à emporter.',score);q('#quiz-next',ctx.stage).hidden=true;return}answered=false;draw();ctx.status('À toi de choisir.');q('[data-answer]',ctx.stage).focus()}});draw();return {key(k){if(/^[1-4]$/.test(k))choose(+k-1)}};
  }
  /* Les aperçus montrent les éléments des jeux maison, sans fausses jaquettes. */
  function preview(cv,id){const x=cv.getContext('2d');field(x,480,230);x.textAlign='center';x.textBaseline='middle';
    if(id==='snake'){[[145,118],[169,118],[193,118],[193,94],[193,70],[217,70],[241,70],[265,70],[265,94],[265,118]].forEach(([a,b],i)=>{x.fillStyle=i===9?'#39dce9':'#a4eb69';x.fillRect(a,b,21,21)});x.fillStyle='#ffe83d';x.fillRect(330,122,15,15)}
    else if(id==='bricks'){for(let r=0;r<5;r++)for(let c=0;c<9;c++){x.fillStyle=COLORS[r];x.fillRect(41+c*45,32+r*21,40,15)}x.fillStyle='#fff4d9';x.fillRect(170,192,95,8);x.fillStyle='#ffe83d';x.fillRect(288,161,8,8)}
    else if(id==='inv'){for(let r=0;r<3;r++)for(let c=0;c<7;c++){x.fillStyle=COLORS[r+1];const a=62+c*51,b=32+r*38;x.fillRect(a+4,b,16,4);x.fillRect(a,b+4,24,12);x.fillRect(a+2,b+16,4,4);x.fillRect(a+18,b+16,4,4)}x.fillStyle='#39dce9';x.fillRect(223,196,34,9);x.fillRect(236,187,8,9);x.fillStyle='#ffe83d';x.fillRect(238,161,4,12)}
    else if(id==='pong'){x.fillStyle='#39dce9';x.fillRect(70,55,9,75);x.fillStyle='#ff3598';x.fillRect(399,120,9,75);x.fillStyle='#ffe83d';x.fillRect(275,73,10,10);x.strokeStyle='#657184';x.setLineDash([5,9]);x.beginPath();x.moveTo(240,15);x.lineTo(240,215);x.stroke();x.setLineDash([])}
    else if(id==='simon'){for(let i=0;i<4;i++){x.fillStyle=COLORS[i];x.fillRect(145+(i%2)*100,20+Math.floor(i/2)*100,90,90);x.fillStyle='#15151d';x.font='bold 30px sans-serif';x.fillText(i+1,190+(i%2)*100,65+Math.floor(i/2)*100)}}
    else if(id==='mines'){for(let r=0;r<5;r++)for(let c=0;c<9;c++){x.fillStyle=c<3?'#182b3b':'#41445a';x.fillRect(70+c*38,20+r*38,34,34);if(c===2){x.fillStyle=COLORS[r%4];x.font='bold 20px monospace';x.fillText(r%3+1,87+c*38,37+r*38)}}}
    else if(id==='reflex'){for(let i=0;i<9;i++){x.fillStyle=i===4?'#ffe83d':'#3d2e50';x.beginPath();x.arc(178+i%3*63,49+Math.floor(i/3)*63,25,0,Math.PI*2);x.fill();x.fillStyle=i===4?'#15151d':'#b7aaca';x.font='bold 20px monospace';x.fillText(i+1,178+i%3*63,49+Math.floor(i/3)*63)}}
    else if(id==='memory'){for(let i=0;i<8;i++){x.fillStyle=COLORS[i%6];x.fillRect(101+i%4*72,33+Math.floor(i/4)*86,62,74);x.fillStyle='#15151d';x.font='bold 30px monospace';x.fillText('?',132+i%4*72,70+Math.floor(i/4)*86)}}
    else if(id==='quiz'){x.fillStyle='#ffe83d';x.font='bold 74px monospace';x.fillText('8 / 8 ?',240,88);x.font='bold 15px monospace';x.fillStyle='#39dce9';x.fillText('TU Y ÉTAIS. TU LE SAIS.',240,161)}
    else if(id==='tama'){const image=new Image();image.onload=()=>{x.drawImage(image,0,0,image.width,image.height,0,0,480,230)};image.src='assets/editorial/tamagotchi-720.webp'}
  }
  window.R90PAGE=init;
})();
