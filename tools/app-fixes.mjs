// Owner-authorized logic fixes. Reapply to owner uploads instead of hand-editing index.html.
// Fail closed if an upstream build changes these entry points; do not silently deploy an unsafe import.
function replace(html, before, after, label) {
  if (html.includes(after)) return html;
  if (html.split(before).length !== 2) throw new Error(`Cannot apply ${label}: owner code changed. Review tools/app-fixes.mjs.`);
  return html.replace(before, after);
}
export function applyAppFixes(html) {
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
