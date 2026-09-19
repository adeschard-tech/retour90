/* Les petites attentions de lecture et de découverte. Aucun compte requis. */
const FAVORIS='retour90.souvenirs.v1';
function souvenirsLire(){try{return JSON.parse(localStorage.getItem(FAVORIS)||'[]')}catch{return []}}
function editionReady(){
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
