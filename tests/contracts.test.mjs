import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { ROOT, ok, failures } from './helpers.mjs';
import { applyLayer } from '../tools/pwa.mjs';
import { applyTrackerChecks } from '../tools/app-fixes.mjs';
import { CHECKS } from '../tools/tracker-checks.mjs';

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
// Tracker checks: an owner build with the original wording gets every correction; a changed event stops the build.
const RX=/(<script type="application\/json" id="dataItems">)([\s\S]*?)(<\/script>)/, items=()=>JSON.parse(html.match(RX)[2]);
const checked=items(), original=structuredClone(checked);
for(const c of CHECKS){const it=original.find(x=>x.id===c.id);delete it.zc;for(const [f,[before]] of Object.entries(c.edit||{}))it[f]=before}
const ownerBuild=items=>html.replace(RX,(_,a,__,b)=>a+JSON.stringify(items)+b);
ok(JSON.stringify(JSON.parse(applyTrackerChecks(ownerBuild(original)).match(RX)[2]))===JSON.stringify(checked),'tracker checks reapply to an owner build with the original wording');
ok(checked.length===57&&checked.every(it=>it.zc)&&checked.filter(it=>it.zc.r==='partial').every(it=>it.st!=='verified'),'every event records its check; partly confirmed events are not marked checked');
const tampered=structuredClone(original);tampered.find(x=>x.id==='TRK-002').w='Assent 1 Sep 2026';
let stopped=false;try{applyTrackerChecks(ownerBuild(tampered))}catch(e){stopped=/TRK-002\.w/.test(e.message)}
ok(stopped,'an event changed since it was checked stops the build');
ok(html.includes('Zola Corpus 2.4, built for UPSC and APSC Prelims 2027. Current to 3 October 2026.')&&!html.includes('Zola Corpus 2.0,'),'footer edition matches the header');
process.exit(failures()?1:0);
