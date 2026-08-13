/* RETOUR90 — l'arcade : Snake, Pong, Simon, Tamagotchi, Casse-briques, Démineur, Invasion, Quiz */
function R90PAGE(){snakeInit();pongInit();simonInit();tamaInit();bricksInit();minesInit();invInit();quizInit()}

/* ---------- CASSE-BRIQUES ---------- */
function bricksInit(){
  const cv=$('#cvBricks');if(!cv)return;const x=cv.getContext('2d');
  const W=260,H=220,BW=30,BH=11,COLS=8,ROWS=5;
  let px=110,bx,by,vx,vy,bricks,sc,lives,run=false,raf=null;
  const COLB=['#FF2E87','#FF7A2F','#FFD23F','#9BF04D','#23E5DE'];
  function reset(){bricks=[];for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++)bricks.push({x:c*(BW+2)+3,y:r*(BH+2)+22,r});
    sc=0;lives=3;serve()}
  function serve(){bx=130;by=150;vx=2.2*(Math.random()<.5?1:-1);vy=-2.6}
  function upd(){$('#scBricks').textContent='SCORE '+sc+' · VIES '+lives+' · RECORD '+S.hi.bricks}
  function draw(){
    x.fillStyle='#07050F';x.fillRect(0,0,W,H);
    bricks.forEach(b=>{x.fillStyle=COLB[b.r];x.fillRect(b.x,b.y,BW,BH)});
    x.fillStyle='#F5F1FF';x.fillRect(px-24,H-12,48,7);
    x.fillStyle='#FFD23F';x.fillRect(bx-3,by-3,6,6);
  }
  function step(){
    bx+=vx;by+=vy;
    if(bx<3||bx>W-3)vx*=-1;
    if(by<3)vy=Math.abs(vy);
    if(by>H-14&&by<H-4&&bx>px-26&&bx<px+26){vy=-Math.abs(vy);vx+=(bx-px)*.06;blip(600,.04)}
    if(by>H){lives--;blip(160,.2,'sawtooth');
      if(lives<=0){end('PERDU · SCORE '+sc);return}serve()}
    for(let i=bricks.length-1;i>=0;i--){const b=bricks[i];
      if(bx>b.x-3&&bx<b.x+BW+3&&by>b.y-3&&by<b.y+BH+3){bricks.splice(i,1);vy*=-1;sc+=10;
        blip(700+b.r*80,.05);break}}
    if(!bricks.length){end('GAGNÉ · SCORE '+sc);return}
    upd();draw();
    if(run)raf=requestAnimationFrame(step);
  }
  function end(m){run=false;cancelAnimationFrame(raf);
    if(sc>S.hi.bricks){S.hi.bricks=sc;save()}upd();toast(m);$('#goBricks').textContent='Rejouer'}
  cv.addEventListener('mousemove',e=>{const r=cv.getBoundingClientRect();px=Math.max(26,Math.min(W-26,(e.clientX-r.left)*(W/r.width)))});
  cv.addEventListener('touchmove',e=>{e.preventDefault();const r=cv.getBoundingClientRect();
    px=Math.max(26,Math.min(W-26,(e.touches[0].clientX-r.left)*(W/r.width)))},{passive:false});
  $('#goBricks').onclick=()=>{reset();run=true;cancelAnimationFrame(raf);step()};
  reset();upd();draw();
}

/* ---------- DÉMINEUR ---------- */
function minesInit(){
  const box=$('#mines');if(!box)return;
  const N=9,M=10;let grid,open,flag,done,wins=+localStorage.getItem('retour90.minewins')||0,flagMode=false;
  function newGame(){
    grid=Array(N*N).fill(0);open=new Set();flag=new Set();done=false;
    let placed=0;while(placed<M){const i=(Math.random()*N*N)|0;if(grid[i]!==-1){grid[i]=-1;placed++}}
    for(let i=0;i<N*N;i++){if(grid[i]===-1)continue;
      grid[i]=around(i).filter(j=>grid[j]===-1).length}
    draw();upd();
  }
  function around(i){const r=(i/N)|0,c=i%N,out=[];
    for(let dr=-1;dr<=1;dr++)for(let dc=-1;dc<=1;dc++){
      if(!dr&&!dc)continue;const nr=r+dr,nc=c+dc;
      if(nr>=0&&nr<N&&nc>=0&&nc<N)out.push(nr*N+nc)}return out}
  function reveal(i){
    if(done||open.has(i)||flag.has(i))return;
    open.add(i);
    if(grid[i]===-1){done=true;blip(140,.35,'sawtooth');toast('BOUM. COMME EN SALLE INFO.');draw();return}
    blip(660,.03);
    if(grid[i]===0)around(i).forEach(reveal);
    if(open.size===N*N-M){done=true;wins++;localStorage.setItem('retour90.minewins',wins);
      if(wins>S.hi.mines){S.hi.mines=wins;save()}
      blip(880,.1);setTimeout(()=>blip(1320,.15),120);toast('DÉMINÉ ! PARTIE GAGNÉE')}
    draw();upd();
  }
  const NC=['','#23E5DE','#9BF04D','#FFD23F','#FF7A2F','#FF2E87','#B57BFF','#fff','#fff'];
  function draw(){
    box.innerHTML=grid.map((v,i)=>{
      const o=open.has(i),f=flag.has(i);
      const boom=done&&v===-1;
      return `<button data-i="${i}" style="aspect-ratio:1;border-radius:3px;font-family:var(--mono);font-size:12px;font-weight:bold;
        display:grid;place-items:center;padding:0;border:1px solid ${o?'rgba(255,255,255,.08)':'rgba(255,255,255,.22)'};
        background:${o?'#0D0918':boom?'#FF2E87':'#241C3B'};color:${v>0?NC[v]:'#fff'}">
        ${boom?'✸':f?'🚩':o&&v>0?v:''}</button>`}).join('');
    $$('#mines button').forEach(b=>{
      b.onclick=()=>{const i=+b.dataset.i;
        if(flagMode){if(!open.has(i)){flag.has(i)?flag.delete(i):flag.add(i);draw();upd()}return}
        reveal(i)};
      b.oncontextmenu=e=>{e.preventDefault();const i=+b.dataset.i;
        if(!open.has(i)){flag.has(i)?flag.delete(i):flag.add(i);draw();upd()}};
    });
  }
  function upd(){$('#scMines').textContent='MINES '+(M-flag.size)+' · GAGNÉES '+wins}
  $('#goMines').onclick=newGame;
  $('#flagMines').onclick=()=>{flagMode=!flagMode;$('#flagMines').textContent='🚩 Drapeau : '+(flagMode?'ON':'OFF')};
  newGame();
}

/* ---------- INVASION ---------- */
function invInit(){
  const cv=$('#cvInv');if(!cv)return;const x=cv.getContext('2d');
  const W=260,H=220;
  let px,shots,aliens,ax,ay,adx,sc,run=false,raf=null,cool=0,keys={},t=0;
  function reset(){px=130;shots=[];sc=0;spawn();}
  function spawn(){aliens=[];for(let r=0;r<3;r++)for(let c=0;c<7;c++)aliens.push({x:c*30+20,y:r*22+18,alive:true});
    ax=0;ay=0;adx=.5}
  function upd(){$('#scInv').textContent='SCORE '+sc+' · RECORD '+S.hi.inv}
  function draw(){
    x.fillStyle='#07050F';x.fillRect(0,0,W,H);
    x.fillStyle='#9BF04D';
    aliens.forEach(a=>{if(!a.alive)return;const ox=a.x+ax,oy=a.y+ay;
      x.fillRect(ox,oy,16,10);x.fillRect(ox+3,oy-3,10,3);
      if((t>>4)%2){x.fillRect(ox-2,oy+10,4,3);x.fillRect(ox+14,oy+10,4,3)}
      else{x.fillRect(ox+2,oy+10,4,3);x.fillRect(ox+10,oy+10,4,3)}});
    x.fillStyle='#23E5DE';x.fillRect(px-10,H-16,20,7);x.fillRect(px-2,H-21,4,5);
    x.fillStyle='#FFD23F';shots.forEach(s=>x.fillRect(s.x-1,s.y,2,7));
  }
  function step(){
    t++;
    if(keys.L)px=Math.max(12,px-3);
    if(keys.R)px=Math.min(W-12,px+3);
    if(keys.F&&cool<=0){shots.push({x:px,y:H-24});cool=16;blip(880,.04)}
    cool--;
    ax+=adx;
    const live=aliens.filter(a=>a.alive);
    if(!live.length){spawn();adx=Math.sign(adx)*(Math.abs(adx)+.15)}
    else{
      const xs=live.map(a=>a.x+ax);
      if(Math.max(...xs)>W-22||Math.min(...xs)<4){adx*=-1;ay+=8}
    }
    shots=shots.filter(s=>{s.y-=5;
      for(const a of aliens){if(!a.alive)continue;
        if(s.x>a.x+ax-2&&s.x<a.x+ax+18&&s.y>a.y+ay-2&&s.y<a.y+ay+12){
          a.alive=false;sc+=20;blip(500,.06,'sawtooth',.04);return false}}
      return s.y>-8});
    if(aliens.some(a=>a.alive&&a.y+ay>H-32)){end('ENVAHI · SCORE '+sc);return}
    upd();draw();
    if(run)raf=requestAnimationFrame(step);
  }
  function end(m){run=false;cancelAnimationFrame(raf);
    if(sc>S.hi.inv){S.hi.inv=sc;save()}upd();toast(m);$('#goInv').textContent='Rejouer'}
  const kd=e=>{if(!run)return;
    if(e.key==='ArrowLeft')keys.L=true;
    if(e.key==='ArrowRight')keys.R=true;
    if(e.key===' '){e.preventDefault();keys.F=true}};
  const ku=e=>{if(e.key==='ArrowLeft')keys.L=false;
    if(e.key==='ArrowRight')keys.R=false;
    if(e.key===' ')keys.F=false};
  addEventListener('keydown',kd);addEventListener('keyup',ku);
  $$('[data-iv]').forEach(b=>{
    const set=v=>{keys[b.dataset.iv]=v};
    b.addEventListener('pointerdown',()=>set(true));
    b.addEventListener('pointerup',()=>set(false));
    b.addEventListener('pointerleave',()=>set(false));
  });
  $('#goInv').onclick=()=>{reset();run=true;cancelAnimationFrame(raf);upd();step()};
  reset();upd();draw();
}

/* ---------- SNAKE ---------- */
function snakeInit(){
  const cv=$('#cvSnake');if(!cv)return;const x=cv.getContext('2d'),G=13,C=20;
  let s,dir,food,run=false,t=null,sc=0;
  function reset(){s=[{x:6,y:6}];dir={x:1,y:0};food=drop();sc=0;upd()}
  function drop(){let p;do{p={x:(Math.random()*G)|0,y:(Math.random()*G)|0}}while(s&&s.some(c=>c.x===p.x&&c.y===p.y));return p}
  function upd(){$('#scSnake').textContent='SCORE '+sc+' · RECORD '+S.hi.snake}
  function draw(){
    x.fillStyle='#07050F';x.fillRect(0,0,260,260);
    x.fillStyle='#FFD23F';x.fillRect(food.x*C+4,food.y*C+4,C-8,C-8);
    s.forEach((c,i)=>{x.fillStyle=i?'#9BF04D':'#23E5DE';x.fillRect(c.x*C+1,c.y*C+1,C-2,C-2)});
  }
  function tick(){
    const h={x:(s[0].x+dir.x+G)%G,y:(s[0].y+dir.y+G)%G};
    if(s.some(c=>c.x===h.x&&c.y===h.y)){stop();toast('PERDU · SCORE '+sc);return}
    s.unshift(h);
    if(h.x===food.x&&h.y===food.y){sc++;food=drop();blip(760,.06);
      if(sc>S.hi.snake){S.hi.snake=sc;save()}upd()}
    else s.pop();
    draw();
  }
  function start(){reset();draw();run=true;clearInterval(t);t=setInterval(tick,130);$('#goSnake').textContent='Recommencer'}
  function stop(){run=false;clearInterval(t);upd()}
  const set=d=>{const m={U:[0,-1],D:[0,1],L:[-1,0],R:[1,0]}[d];if(!m)return;
    if(m[0]===-dir.x&&m[1]===-dir.y)return;dir={x:m[0],y:m[1]}};
  $('#goSnake').onclick=start;
  $$('.pad button').forEach(b=>b.onclick=()=>set(b.dataset.k));
  addEventListener('keydown',e=>{if(!run)return;
    const m={ArrowUp:'U',ArrowDown:'D',ArrowLeft:'L',ArrowRight:'R'}[e.key];
    if(m){e.preventDefault();set(m)}});
  let sx=0,sy=0;
  cv.addEventListener('touchstart',e=>{sx=e.touches[0].clientX;sy=e.touches[0].clientY},{passive:true});
  cv.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy;
    set(Math.abs(dx)>Math.abs(dy)?(dx>0?'R':'L'):(dy>0?'D':'U'))});
  reset();draw();
}

/* ---------- PONG ---------- */
function pongInit(){
  const cv=$('#cvPong');if(!cv)return;const x=cv.getContext('2d');
  const W=260,H=200;let py=80,ay=80,bx=130,by=100,vx=3,vy=2.1,ps=0,as=0,raf=null,run=false;
  function draw(){
    x.fillStyle='#07050F';x.fillRect(0,0,W,H);
    x.strokeStyle='rgba(255,255,255,.15)';x.setLineDash([5,7]);x.beginPath();x.moveTo(W/2,0);x.lineTo(W/2,H);x.stroke();x.setLineDash([]);
    x.fillStyle='#23E5DE';x.fillRect(8,py,5,42);
    x.fillStyle='#FF2E87';x.fillRect(W-13,ay,5,42);
    x.fillStyle='#FFD23F';x.fillRect(bx-3,by-3,6,6);
  }
  function step(){
    bx+=vx;by+=vy;
    if(by<3||by>H-3)vy*=-1;
    if(bx<16&&bx>10&&by>py&&by<py+42){vx=Math.abs(vx)*1.03;vy+=(by-(py+21))*.05;blip(600,.04)}
    if(bx>W-16&&bx<W-10&&by>ay&&by<ay+42){vx=-Math.abs(vx)*1.03;vy+=(by-(ay+21))*.05;blip(420,.04)}
    ay+=Math.max(-2.6,Math.min(2.6,(by-(ay+21))*.09));
    if(bx<0){as++;serve(1)}
    if(bx>W){ps++;serve(-1);blip(900,.1)}
    $('#scPong').textContent=ps+' — '+as;
    draw();
    if(ps>=5){end('GAGNÉ !');return}
    if(as>=5){end('PERDU…');return}
    if(run)raf=requestAnimationFrame(step);
  }
  function serve(d){bx=W/2;by=H/2;vx=3*d;vy=(Math.random()*3-1.5)||1.4}
  function end(m){run=false;cancelAnimationFrame(raf);toast(m);$('#goPong').textContent='Rejouer'}
  cv.addEventListener('mousemove',e=>{const r=cv.getBoundingClientRect();py=Math.max(0,Math.min(H-42,(e.clientY-r.top)*(H/r.height)-21))});
  cv.addEventListener('touchmove',e=>{e.preventDefault();const r=cv.getBoundingClientRect();
    py=Math.max(0,Math.min(H-42,(e.touches[0].clientY-r.top)*(H/r.height)-21))},{passive:false});
  $('#goPong').onclick=()=>{ps=as=0;serve(1);run=true;cancelAnimationFrame(raf);step()};
  draw();
}

/* ---------- SIMON ---------- */
function simonInit(){
  const box=$('#simon');if(!box)return;
  const T=[330,415,494,622];let seq=[],pos=0,lock=true,tos=[];
  const pads=$$('#simon button');
  function lit(i,d=380){pads[i].classList.add('lit');blip(T[i],d/1000,'triangle',.07);
    tos.push(setTimeout(()=>pads[i].classList.remove('lit'),d-60))}
  function playSeq(){lock=true;seq.forEach((v,k)=>tos.push(setTimeout(()=>lit(v),k*520+400)));
    tos.push(setTimeout(()=>{lock=false;pos=0},seq.length*520+420))}
  function grow(){seq.push((Math.random()*4)|0);$('#scSimon').textContent='NIVEAU '+seq.length+' · RECORD '+S.hi.simon;playSeq()}
  pads.forEach((p,i)=>p.onclick=()=>{
    if(lock)return;lit(i,220);
    if(seq[pos]!==i){lock=true;toast('RATÉ · NIVEAU '+seq.length);blip(140,.3,'sawtooth');
      if(seq.length-1>S.hi.simon){S.hi.simon=seq.length-1;save()}return}
    pos++;
    if(pos>=seq.length){lock=true;
      if(seq.length>S.hi.simon){S.hi.simon=seq.length;save()}
      tos.push(setTimeout(grow,700))}
  });
  $('#goSimon').onclick=()=>{tos.forEach(clearTimeout);tos=[];seq=[];grow()};
}

/* ---------- TAMAGOTCHI ---------- */
function tamaInit(){
  if(!$('#tmFace'))return;
  if(!S.tama)S.tama={f:100,j:100,n:1,x:0,t:Date.now(),born:Date.now()};
  const T=S.tama;
  function decay(){const h=(Date.now()-T.t)/36e5;T.f=Math.max(0,T.f-h*9);T.j=Math.max(0,T.j-h*7);T.t=Date.now()}
  function face(){if(T.f<20||T.j<20)return '(╥﹏╥)';if(T.f<50||T.j<50)return '(・_・)';if(T.n>=5)return '(★ᴗ★)';return '(•ᴗ•)'}
  function draw(){decay();
    $('#tmFace').textContent=face();
    $('#tmA').textContent='FAIM '+Math.round(T.f);
    $('#tmB').textContent='JOIE '+Math.round(T.j);
    $('#tmC').textContent='NIV. '+T.n;
    $('#tmD').textContent=Math.floor((Date.now()-T.born)/864e5)+' j';
    save()}
  $$('[data-tm]').forEach(b=>b.onclick=()=>{
    decay();const a=b.dataset.tm;
    if(a==='eat'){T.f=Math.min(100,T.f+22);blip(660,.06)}
    if(a==='play'){T.j=Math.min(100,T.j+20);blip(880,.06)}
    if(a==='sleep'){T.f=Math.min(100,T.f+8);T.j=Math.min(100,T.j+8);blip(330,.14)}
    T.x++;if(T.x%6===0){T.n++;toast('IL A GRANDI · NIVEAU '+T.n)}
    draw()});
  draw();setInterval(draw,20000);
}

/* ---------- QUIZ ---------- */
const QUIZ=[
 ['En quelle année la France gagne-t-elle sa première Coupe du monde ?',['1994','1996','1998','2000'],2],
 ['Que trouvait-on dans un Carambar, en plus du caramel ?',['Un autocollant','Une blague','Un jeton','Un code'],1],
 ['Quel appareil fallait-il nourrir pour qu’il ne meure pas ?',['Le Furby','Le Game Boy','Le Tamagotchi','Le Bi-Bop'],2],
 ['Sur quelle console jouait-on à Sonic à sa sortie ?',['Super Nintendo','Mega Drive','PlayStation','Game Boy'],1],
 ['Que fallait-il faire avant de rapporter une VHS au vidéoclub ?',['La nettoyer','La rembobiner','La recopier','La ranger'],1],
 ['Comment se connectait-on en France avant Internet ?',['Le Minitel','Le Bi-Bop','Le Tatoo','Le télex'],0],
 ['Quel jeu était fourni sur le Nokia 3210 ?',['Tetris','Pong','Snake','Solitaire'],2],
 ['Quelle émission jeunesse s’arrête en 1997 ?',['Les Minikeums','Le Club Dorothée','Ça Cartoon','Graine de Star'],1],
 ['Que se collait-on sur le bras avec un Malabar ?',['Un autocollant','Un tatouage','Un POG','Une vignette'],1],
 ['Qu’a-t-on tous observé en France le 11 août 1999 ?',['Une comète','Une éclipse totale','Une aurore boréale','Une pluie d’étoiles'],1],
 ['Quel film de 1993 a fait trembler un verre d’eau ?',['Titanic','Jurassic Park','Matrix','Terminator 2'],1],
 ['Qui chantait les génériques du Club Dorothée version manga ?',['Ariane et Bernard Minet','Dorothée seule','Hélène Rollès','Les Musclés'],0],
 ['Quelle chaîne s’est éteinte en direct le 12 avril 1992 ?',['TV6','La Cinq','La Sept','Télé Lyon'],1],
 ['Quel bouton magique réparait une cartouche qui plantait ?',['RESET','On soufflait dedans','START','EJECT'],1]
];
let qi=0,qs=0,qset=[];
function quizInit(){if(!$('#quizbox'))return;qset=[...QUIZ].sort(()=>Math.random()-.5).slice(0,8);qi=0;qs=0;quizDraw()}
function quizDraw(){
  const b=$('#quizbox');if(!b)return;
  if(qi>=qset.length){
    S.hi.quiz=Math.max(S.hi.quiz,qs);save();
    b.innerHTML=`<div style="font-family:var(--mono);font-size:11px;letter-spacing:.2em;color:var(--mag)">RÉSULTAT</div>
      <h3 style="font-family:var(--display);font-size:42px;margin:8px 0;text-transform:uppercase;font-weight:normal">${qs} / ${qset.length}</h3>
      <p>${qs>=7?'Tu y étais. Aucun doute possible.':qs>=5?'Tu y étais, mais tu regardais l’autre chaîne.':'Tu es né en 2003, avoue.'}</p>
      <button class="btn sm" onclick="quizInit()">Rejouer</button>`;
    return;
  }
  const q=qset[qi];
  b.innerHTML=`<div style="font-family:var(--mono);font-size:11px;letter-spacing:.2em;color:var(--mag)">LE ZAPPING · QUESTION ${qi+1}/${qset.length}</div>
   <div class="bar"><i style="width:${qi/qset.length*100}%"></i></div>
   <h3 style="font-family:var(--display);font-size:23px;margin:6px 0 14px;text-transform:uppercase;letter-spacing:.02em;font-weight:normal">${q[0]}</h3>
   ${q[1].map((o,i)=>`<button class="q-opt" data-i="${i}">${o}</button>`).join('')}`;
  $$('#quizbox .q-opt').forEach(btn=>btn.onclick=()=>{
    const ok=+btn.dataset.i===q[2];
    $$('#quizbox .q-opt').forEach(x=>{if(+x.dataset.i===q[2])x.classList.add('good')});
    if(!ok)btn.classList.add('bad');else qs++;
    blip(ok?880:180,.12,ok?'square':'sawtooth');
    $$('#quizbox .q-opt').forEach(x=>x.onclick=null);
    setTimeout(()=>{qi++;quizDraw()},820);
  });
}
