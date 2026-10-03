import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { ROOT, ok, failures } from './helpers.mjs';
import { applyLayer } from '../tools/pwa.mjs';

const sandbox={window:{},URL};vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(ROOT,'pwa/data.js'),'utf8'),sandbox);
const data=sandbox.window.ZOLA_DATA;
const fixture=JSON.parse(fs.readFileSync(path.join(ROOT,'tests/fixtures/feed-validation.json')));
console.log('Data contracts and owner-build safeguards');
for(const c of fixture.cases){
 const f=structuredClone(fixture.base);
 for(const ch of c.changes){let target=f;for(const k of ch.path.slice(0,-1))target=target[k];if(ch.remove)delete target[ch.path.at(-1)];else Object.defineProperty(target,ch.path.at(-1),{value:ch.value,writable:true,enumerable:true,configurable:true});}
 let accepted=true;try{data.feed(f)}catch(e){accepted=false}
 ok(accepted===c.valid,'feed: '+c.name);
}
const html=fs.readFileSync(path.join(ROOT,'index.html'),'utf8');
ok(applyLayer(html)===html,'app and PWA fixes are idempotent');
const fresh=html.replace(/ window\.ZOLA_DATA\.feed\(f\);[^\n]*\n/,'');
ok(applyLayer(fresh)===html,'a fresh owner feed validator receives the safeguard again');
let refused=false;try{applyLayer(fresh.replace('function validate(f){','function renamedValidate(f){'))}catch(e){refused=true}
ok(refused,'changed upstream entry points fail the build instead of losing the safeguard');
process.exit(failures()?1:0);
