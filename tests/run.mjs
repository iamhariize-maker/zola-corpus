// npm test: build _site, then run every browser suite. Exit code is non-zero if anything fails.
import { execSync, spawnSync } from 'node:child_process';
import { ROOT } from './helpers.mjs';
execSync('node tools/pwa.mjs build _site', { cwd: ROOT, stdio: 'inherit' });
let bad = 0;
for (const f of ['tests/contracts.test.mjs', 'tests/pwa.test.mjs', 'tests/ux.test.mjs', 'tests/data.test.mjs', 'tests/stats.test.mjs']) {
  const r = spawnSync(process.execPath, [f], { cwd: ROOT, stdio: 'inherit' });
  if (r.status !== 0) bad++;
}
console.log(bad ? `\n✗ ${bad} suite(s) failed` : '\n✓ all suites passed');
process.exit(bad ? 1 : 0);
