import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source=fs.readFileSync(new URL('../assets/arcade.js',import.meta.url),'utf8').replace('window.R90PAGE=init;','window.test={snake,pong,bricks,invasion,mines};');
const env={window:{},S:{hi:{}},console,Math,Image:class{},localStorage:{getItem(){return null},setItem(){}},save(){}};
vm.runInNewContext(source,env);
let passed=0;
function context(){
  const events=new Map(),rects=[];let fill='';
  const painter=new Proxy({}, {get(_o,k){if(k==='fillRect')return(...args)=>rects.push({fill,args});return()=>{}},set(_o,k,v){if(k==='fillStyle')fill=v;return true}});
  const board={innerHTML:''},mode={textContent:'',setAttribute(){}};
  return {events,rects,game:{id:'test'},stage:{innerHTML:'',querySelector(s){return s==='.mine-board'?board:mode}},board,keys:new Set(),running:true,time:0,canvas(){return[{getBoundingClientRect(){return {left:0,top:0,width:480,height:360}},setPointerCapture(){}},painter]},controls(){},on(el,event,fn){if(!events.has(el))events.set(el,{});events.get(el)[event]=fn},score(n,extra){this.sc=n;this.extra=extra},sound(){},status(s){this.message=s},record(n){this.best=Math.max(this.best||0,n)},finish(s,n){this.running=false;this.final=n;this.message=s},later(){}};
}
{
  const c=context(),g=env.window.test.snake(c);
  for(let i=0;i<5;i++)g.tick(150);
  assert.equal(c.sc,1,'Snake mange la première cible');
  g.key('ArrowUp');g.key('ArrowLeft');g.tick(150);g.draw();
  assert.ok(c.rects.some(r=>r.fill==='#35dbe9'&&r.args[0]===281&&r.args[1]===181),'Pas de demi-tour à travers le corps entre deux ticks');passed+=2;
}
{
  const c=context(),g=env.window.test.bricks(c);
  for(let i=0;i<15000&&c.running;i++)g.tick(1000/60);
  assert.equal(c.running,false,'Casse-briques atteint un état de fin');assert.ok(c.final>=0&&c.final<=500);passed+=2;
}
{
  const c=context(),g=env.window.test.invasion(c);c.keys.add(' ');
  for(let i=0;i<1000&&c.running;i++)g.tick();
  assert.ok(c.sc>0,'Les tirs détruisent les envahisseurs');assert.equal(c.sc%20,0);passed+=2;
}
{
  for(let cell=0;cell<81;cell++){
    const c=context();env.window.test.mines(c);
    c.events.get(c.board).click({target:{closest(){return {dataset:{cell:String(cell)}}}}});
    assert.notEqual(c.final,0,'Premier clic sûr, case '+cell);
    assert.ok(c.sc>0,'Le premier clic révèle des cases, case '+cell);
  }passed+=162;
}
console.log(passed+' vérifications de mécanique réussies.');
