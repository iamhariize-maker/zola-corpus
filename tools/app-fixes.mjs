// Owner-authorized logic fixes. Reapply to owner uploads instead of hand-editing index.html.
// Fail closed if an upstream build changes these entry points; do not silently deploy an unsafe import.
import { CHECKS, CHECKED_ON } from './tracker-checks.mjs';
function replace(html, before, after, label) {
  if (html.includes(after)) return html;
  if (html.split(before).length !== 2) throw new Error(`Cannot apply ${label}: owner code changed. Review tools/app-fixes.mjs.`);
  return html.replace(before, after);
}
// Owner-approved tracker check (3 Oct 2026): correct the checked events and record what was checked, then show it.
const ITEMS_RX = /(<script type="application\/json" id="dataItems">)([\s\S]*?)(<\/script>)/;
export function applyTrackerChecks(html) {
  const m = html.match(ITEMS_RX);
  if (!m) throw new Error('Cannot apply tracker checks: dataItems not found. Review tools/tracker-checks.mjs.');
  const items = JSON.parse(m[2]), byId = new Map(items.map(it => [it.id, it]));
  for (const c of CHECKS) {
    const it = byId.get(c.id);
    if (!it) throw new Error(`Cannot apply tracker checks: ${c.id} is no longer in the owner data. Recheck tools/tracker-checks.mjs.`);
    for (const [field, [before, after]] of Object.entries(c.edit || {})) {
      if (it[field] === after) continue;
      if (it[field] !== before) throw new Error(`Cannot apply tracker checks: ${c.id}.${field} changed since it was checked. Recheck it.`);
      it[field] = after;
    }
    if (c.result !== 'partial') { it.st = 'verified'; it.evidence_status = 'VERIFIED'; }
    it.zc = { r: c.result, on: CHECKED_ON, note: c.note, src: c.src };
  }
  const json = JSON.stringify(items).replace(/<\//g, '<\\/');
  return html.replace(ITEMS_RX, (_, a, __, b) => a + json + b);
}
function applyTrackerDisplay(html) {
  html = replace(html,
    `(it.st==='verified'?'<span class="tag ver">Source linked · UNVERIFIED</span>':it.st==='check'?'<span class="tag chk">Needs checking</span>':'<span class="tag car">From v1</span>')`,
    `(it.zc?(it.zc.r==='partial'?'<span class="tag chk">Partly checked</span>':'<span class="tag ver">Checked 3 Oct 2026</span>'):it.st==='verified'?'<span class="tag ver">Source linked · UNVERIFIED</span>':it.st==='check'?'<span class="tag chk">Needs checking</span>':'<span class="tag car">From v1</span>')`,
    'tracker check tags');
  html = replace(html,
    `'<dt>Source</dt><dd>'+esc(it.src)+(it.url?' <a href="'+esc(it.url)+'" rel="noopener" target="_blank">Open the release</a>':'')+'</dd></dl>'`,
    `'<dt>Source</dt><dd>'+esc(it.src)+(it.url?' <a href="'+esc(it.url)+'" rel="noopener" target="_blank">Open the release</a>':'')+'</dd>'+(it.zc?'<dt>Checked 3 Oct 2026</dt><dd>'+esc(it.zc.note)+(it.zc.src.length?' '+it.zc.src.map(function(s){return '<a href="'+esc(s.url)+'" rel="noopener" target="_blank">'+esc(s.name)+'</a>'}).join(' · '):'')+'</dd>':'')+'</dl>'`,
    'tracker check sources');
  html = replace(html, `stat(v,'source links present; not rechecked in this build')`, `stat(v,'checked against sources on 3 Oct 2026')`, 'tracker check brief figure');
  html = replace(html, 'data-v="verified" aria-pressed="false">Source link present</button>', 'data-v="verified" aria-pressed="false">Checked</button>', 'tracker check filter');
  html = replace(html, '<li>Events marked "From v1" were not re-checked in the October round. Check them before relying on a detail. Two are flagged "Needs checking".</li>',
    '<li>All 57 events were checked against official records or reliable reports on 3 Oct 2026. Fourteen were corrected or updated and three are only partly confirmed ("Partly checked"). Each event shows what was checked, with links. Check anything newer than that date yourself.</li>', 'tracker check sources note');
  return html;
}
export function applyAppFixes(html) {
  html = applyTrackerDisplay(applyTrackerChecks(html));
  // Owner-approved 3 Oct 2026: the footer matches the header's edition and date.
  html = replace(html, 'PLA5h. Zola Corpus 2.0, built for UPSC and APSC Prelims 2027. Current to 2 October 2026.', 'PLA5h. Zola Corpus 2.4, built for UPSC and APSC Prelims 2027. Current to 3 October 2026.', 'footer edition');
  html = replace(html, "function validate(f){\n if(!f||typeof f!=='object')", "function validate(f){\n window.ZOLA_DATA.feed(f); // zola-app-fix: strict feed contract\n if(!f||typeof f!=='object')", 'feed validation');
  html = replace(html,
    "$('#b-import').onchange=e=>{const f=e.target.files[0];if(!f)return;f.text().then(t=>{const d=JSON.parse(t);if(!d.data||!d.data.traps)throw new Error('not a Zola B progress file');mem=Object.assign(load(),d.data);save();render('review');$('#b-io').textContent='Imported.'}).catch(err=>{$('#b-io').textContent='Import failed: '+err.message})};",
    `$('#b-import').onchange=e=>{ // zola-app-fix: validate before replacing progress
 const f=e.target.files[0];if(!f)return;e.target.value='';
 if(f.size>20000000){$('#b-io').textContent='Import failed: file exceeds 20 MB.';return}
 f.text().then(t=>{const d=JSON.parse(t);const candidate=window.ZOLA_DATA.hacking(d.data);
 if(!confirm('Replace all Hacking progress on this device with '+Object.keys(candidate.traps).length+' imported trap records?'))return;
 const previous=localStorage.getItem(KEY),priorMem=mem;
 localStorage.setItem(KEY,JSON.stringify(candidate));mem=candidate;
 try{render('review');updateDue()}catch(err){if(previous===null)localStorage.removeItem(KEY);else localStorage.setItem(KEY,previous);mem=priorMem;render('review');throw err}
 $('#b-io').textContent='Imported. Hacking progress replaced.';
 }).catch(err=>{$('#b-io').textContent='Import failed: '+err.message})};`, 'safe progress import');
  return html;
}
