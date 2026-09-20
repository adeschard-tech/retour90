// Empreintes de tous les scripts et styles, jusque dans les dossiers.
import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';
const assets=Object.fromEntries(fs.readdirSync('assets').filter(f=>/\.(css|js)$/.test(f)).map(f=>['assets/'+f,crypto.createHash('sha256').update(fs.readFileSync('assets/'+f)).digest('hex').slice(0,10)]));
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.name.startsWith('.')||['assets','tools','content'].includes(e.name)?[]:e.isDirectory()?walk(path.join(dir,e.name)):e.name.endsWith('.html')?[path.join(dir,e.name)]:[]);
let n=0;for(const file of walk('.')){let h=fs.readFileSync(file,'utf8'),old=h;h=h.replace(/(assets\/[a-z0-9.-]+\.(?:css|js))(?:\?v=[a-f0-9]+)?/g,(all,a)=>assets[a]?a+'?v='+assets[a]:all);if(h!==old){fs.writeFileSync(file,h);n++}}console.log(n+' pages versionnées.');
