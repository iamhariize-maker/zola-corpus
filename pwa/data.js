// Shared data checks for imports, backups and the live feed. Inlined by tools/pwa.mjs.
(function(){
'use strict';
function need(ok,msg){if(!ok)throw new Error(msg)}
function obj(v){return !!v&&typeof v==='object'&&!Array.isArray(v)}
function num(v){return typeof v==='number'&&isFinite(v)}
function text(v,max){return typeof v==='string'&&v.trim().length>0&&v.length<=max}
function date(v){if(typeof v!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(v)||+v.slice(0,4)<1)return false;var d=new Date(v+'T00:00:00Z');return !isNaN(+d)&&d.toISOString().slice(0,10)===v}
function time(v){return typeof v==='string'&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|\+00:00)$/.test(v)&&date(v.slice(0,10))&&!isNaN(Date.parse(v))&&+v.slice(11,13)<24&&+v.slice(14,16)<60&&+v.slice(17,19)<60}
function url(v){return typeof v==='string'&&/^https:\/\/[^\s"'<>]+$/.test(v)&&v.length<=600&&!!(function(){try{return new URL(v).hostname}catch(e){return ''}})()}
function optional(v,max){return v===undefined||v===''||text(v,max)}
function safe(v){if(!v||typeof v!=='object')return;Object.keys(v).forEach(function(k){need(k!=='__proto__'&&k!=='constructor'&&k!=='prototype','Unsupported data field: '+k);safe(v[k])})}
function source(s){need(s===undefined||obj(s),'Invalid source');if(s){need(optional(s.title,160),'Invalid source title');need(s.url===undefined||s.url===''||url(s.url),'Source links must use https://')}}
function tags(v,values,label,max){need(v===undefined||(Array.isArray(v)&&v.length<=max&&v.every(function(x){return values.indexOf(x)>=0})&&new Set(v).size===v.length),'Invalid '+label)}
var machines=[],subjects=['Polity','Economy','Environment','S&T','IR','History'];for(var i=1;i<=23;i++)machines.push('M'+('0'+i).slice(-2));
function feed(f){
 need(obj(f)&&f.schema==='zola-feed/1','Invalid feed schema');safe(f);need(time(f.updated),'Feed updated must be a UTC ISO timestamp');
 [['exams',30],['watch',120],['events',250],['inbox',250],['notices',20]].forEach(function(rule){var k=rule[0],a=f[k];need(Array.isArray(a)&&a.length<=rule[1],'Invalid '+k+' list');var seen={};
  a.forEach(function(e){need(obj(e),'Invalid '+k+' record');if(k!=='watch'){need(text(e.id,k==='inbox'?80:60),'Missing '+k+' id');need(!Object.prototype.hasOwnProperty.call(seen,e.id),'Duplicate '+k+' id');seen[e.id]=true}
   if(k==='exams'){need(text(e.label,140)&&date(e.date),'Invalid exam label or date');need(e.primary===undefined||typeof e.primary==='boolean','Invalid primary flag');need(e.status===undefined||['scheduled','tentative','postponed','held'].indexOf(e.status)>=0,'Invalid exam status');need(e.checked===undefined||e.checked===''||date(e.checked),'Invalid checked date');source(e.source)}
   if(k==='watch'||k==='events'){need(text(e.title,k==='watch'?200:220)&&date(e.date),'Invalid '+k+' title or date');need(optional(e.hook,k==='watch'?400:500),'Invalid hook');source(e.source)}
   if(k==='watch')need(optional(e.kind,24),'Invalid watch kind');
   if(k==='events'){need(e.status===undefined||['UNVERIFIED','VERIFIED'].indexOf(e.status)>=0,'Invalid event status');need(e.subject===undefined||e.subject===''||subjects.indexOf(e.subject)>=0,'Invalid event subject');tags(e.machines,machines,'machine tags',6)}
   if(k==='inbox'){need(text(e.title,300)&&url(e.url),'Invalid inbox title or URL');need(e.published===undefined||e.published===''||time(e.published),'Invalid published time');need(optional(e.source,40),'Invalid inbox source');tags(e.machines,machines,'machine tags',6);tags(e.subjects,subjects,'subject tags',5)}
   if(k==='notices'){need(text(e.text,500),'Invalid notice text');need(e.date===undefined||e.date===''||date(e.date),'Invalid notice date');need(e.level===undefined||['info','correction','warning'].indexOf(e.level)>=0,'Invalid notice level');need(e.url===undefined||e.url===''||url(e.url),'Invalid notice URL')}
  })});
 need(f.exams.filter(function(e){return e.primary===true}).length<=1,'More than one primary exam');
 if(f.edition!==undefined&&f.edition!==null){need(obj(f.edition),'Invalid edition');need(optional(f.edition.latest,12)&&optional(f.edition.note,200),'Invalid edition text');need(f.edition.url===undefined||f.edition.url===''||url(f.edition.url),'Invalid edition URL')}
 need(JSON.stringify(f).length<1400000,'Feed too large');return f;
}
function hacking(v){
 need(obj(v)&&obj(v.traps),'Not a Zola Hacking progress file');safe(v);
 need(v.walks===undefined||obj(v.walks),'Invalid walkthroughs');need(v.prefs===undefined||obj(v.prefs),'Invalid preferences');
 var p=Object.assign({prompts:'on',cap:12},v.prefs||{});need(['on','quiet'].indexOf(p.prompts)>=0&&num(p.cap)&&p.cap%1===0&&p.cap>=3&&p.cap<=60,'Invalid review preferences');
 Object.keys(v.traps).forEach(function(id){var t=v.traps[id];need(text(id,160)&&obj(t)&&num(t.box)&&t.box%1===0&&t.box>=0&&t.box<=6&&num(t.due)&&t.due>=0&&Array.isArray(t.hist),'Invalid trap record: '+id);
  t.hist.forEach(function(h){need(obj(h)&&num(h.at)&&h.at>=0&&['right','wrong','peek','pass'].indexOf(h.r)>=0&&(h.c===undefined||h.c===null||['sure','think','guess'].indexOf(h.c)>=0),'Invalid trap history: '+id)})});
 Object.keys(v.walks||{}).forEach(function(id){var w=v.walks[id];need(obj(w)&&Array.isArray(w.found)&&w.found.every(function(x){return text(x,160)}),'Invalid walkthrough: '+id)});
 need(v.last===undefined||machines.indexOf(v.last)>=0,'Invalid last machine');return Object.assign({},v,{walks:v.walks||{},prefs:p});
}
function csat(v){
 need(obj(v),'Invalid CSAT progress');safe(v);need(v.ledger===undefined||Array.isArray(v.ledger),'Invalid CSAT ledger');need(v.mocks===undefined||Array.isArray(v.mocks),'Invalid mock history');need(v.set===undefined||obj(v.set),'Invalid CSAT settings');
 (v.ledger||[]).forEach(function(r){need(obj(r)&&text(r.id,160)&&(r.ok===null||typeof r.ok==='boolean')&&num(r.t)&&r.t>=0&&num(r.ts)&&r.ts>=0&&(r.par===undefined||num(r.par))&&(r.conf===null||['sure','half','hunch'].indexOf(r.conf)>=0),'Invalid CSAT ledger record')});
 (v.mocks||[]).forEach(function(m){need(obj(m)&&text(m.bp,160)&&text(m.code,6)&&typeof m.pass==='boolean'&&['ts','score','max','need','att','n'].every(function(k){return num(m[k])}),'Invalid mock result')});
 if(v.live!==undefined&&v.live!==null){var m=v.live;need(obj(m)&&Array.isArray(m.qs)&&m.qs.length>0&&num(m.cur)&&m.cur%1===0&&m.cur>=0&&m.cur<m.qs.length&&num(m.end)&&text(m.bpName,160)&&text(m.code,6),'Invalid unfinished paper');
  ['ans','flag','spent'].forEach(function(k){need(Array.isArray(m[k])&&m[k].length===m.qs.length,'Invalid unfinished paper '+k)});
  m.qs.forEach(function(q,i){need(obj(q)&&text(q.id,160)&&text(q.name,300)&&text(q.stem,30000)&&obj(q.o)&&Array.isArray(q.o.opts)&&q.o.opts.length===4&&q.o.opts.every(function(x){return typeof x==='string'})&&num(q.o.ans)&&q.o.ans%1===0&&q.o.ans>=0&&q.o.ans<4&&Array.isArray(q.o.traps)&&Array.isArray(q.sol)&&q.sol.every(function(x){return typeof x==='string'})&&(q.refs===undefined||Array.isArray(q.refs))&&(m.ans[i]===null||num(m.ans[i])&&m.ans[i]%1===0&&m.ans[i]>=0&&m.ans[i]<4)&&typeof m.flag[i]==='boolean'&&num(m.spent[i])&&m.spent[i]>=0,'Invalid unfinished question')})}
 if(v.theme!==undefined)need(['auto','light','dark'].indexOf(v.theme)>=0,'Invalid CSAT theme');return v;
}
function storageKey(k){return /^(?:zolaV2\.|zola\.)/.test(k)||k==='zolaB.v22'||k==='zolaCsatForge.v1'}
function storageValue(k,value){
 need(typeof value==='string','Backup values must be strings');var v;
 if(k==='zolaB.v22')hacking(JSON.parse(value));
 if(k==='zolaCsatForge.v1')csat(JSON.parse(value));
 if(k==='zolaV2.theme')need(['auto','light','dark'].indexOf(JSON.parse(value))>=0,'Invalid theme');
 if(k==='zolaV2.w'){v=JSON.parse(value);need(obj(v)&&['hook','stage','persist','pyq','first','scale','recency','bg'].every(function(n){return num(v[n])&&v[n]>=0&&v[n]<=100}),'Invalid tracker weights')}
 if(k==='zolaV2.open'){v=JSON.parse(value);need(obj(v),'Invalid open tracker records');safe(v)}
 if(k==='zolaV2.abs')need(typeof JSON.parse(value)==='boolean','Invalid tracker threshold setting');
 if(k==='zola.live.v1'){v=JSON.parse(value);need(obj(v)&&(v.url===''||url(v.url)),'Invalid saved feed settings');if(v.feed)feed(Object.assign({schema:'zola-feed/1'},v.feed))}
}
window.ZOLA_DATA={feed:feed,hacking:hacking,csat:csat,storageKey:storageKey,storageValue:storageValue,time:time,safe:safe};
})();
