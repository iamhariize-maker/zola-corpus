// Source gates (ZC-02 review, Task A): every gate on synthetic text. No network, no files.
import { ROOT, ok, failures } from './helpers.mjs';
import { licenceGate, similarityGate, numberGate, approvalGate, volumeGate, freshnessGate, checkDraft, sha256 } from '../tools/source-gates.mjs';

const REF = 'The Monetary Policy Committee voted unanimously to increase the policy repo rate by 25 basis points to 5.50 per cent. Two members wanted the stance to stay neutral.';
const OWN = 'The rate went up by a quarter point to 5.50 per cent, and the vote on the rate was unanimous.';
void ROOT;

console.log('Source gates: licence');
ok(licenceGate({ reuse: 'allowed', fact_text: null }).ok, 'an allowed source passes the licence gate');
ok(!licenceGate({ reuse: 'link-only', fact_text: null }).ok, 'a link-only source is blocked from reproducing text');
ok(!licenceGate({ reuse: 'free', fact_text: null }).ok, 'an unknown reuse value is blocked');
ok(!licenceGate(null).ok, 'a missing record is blocked');

console.log('Source gates: similarity');
ok(!similarityGate(REF, REF).ok, 'a verbatim copy is blocked');
ok(similarityGate(OWN, REF).ok, 'the same facts in our own words pass');
const partial = 'Read this: The Monetary Policy Committee voted unanimously to increase the policy repo rate by 25 basis points to 5.50 per cent. Then our own line.';
ok(!similarityGate(partial, REF).ok, 'a long copied run inside a larger note is blocked');
ok(similarityGate('cattle grazing near fields', 'cat sat on mats').longestRun === 0, 'matching is by whole words, not substrings');

console.log('Source gates: numbers');
ok(numberGate('repo rate of 5.50 per cent', REF).ok, 'a number present in the reference passes');
ok(!numberGate('repo rate of 6.00 per cent', REF).ok, 'a number missing from the reference is flagged');
ok(numberGate('a total of 1,000 lakh', 'the total was 1000 lakh').ok, 'digit grouping with commas is ignored');
ok(numberGate('in 2026', 'in 2026').ok && !numberGate('in 2027', 'in 2026').ok, 'years are checked like other numbers');

console.log('Source gates: approval');
const draft = 'Our note on the repo rate.';
const evidence = ['page one text', 'page two text'];
const approval = { approved_by: 'owner', approved_at: '2026-10-16T19:00:00Z', draft_sha256: sha256(draft), evidence_sha256: evidence.map(sha256) };
ok(approvalGate({ draft, evidence, approval }).ok, 'an approval that matches the draft and evidence passes');
ok(!approvalGate({ draft: draft + ' edited', evidence, approval }).ok, 'an edit after approval fails');
ok(!approvalGate({ draft, evidence: ['page one text', 'changed page'], approval }).ok, 'changed evidence fails');
ok(!approvalGate({ draft, evidence: [evidence[0]], approval }).ok, 'a missing evidence text fails');
ok(!approvalGate({ draft, evidence, approval: null }).ok, 'no approval record fails');
ok(!approvalGate({ draft, evidence, approval: { ...approval, approved_by: '' } }).ok, 'an approval without a named approver fails');

console.log('Source gates: volume and freshness');
const prev = [{ source: 'pib', count: 20 }, { source: 'sci', count: 25 }];
ok(volumeGate([{ source: 'pib', status: 'ok', count: 19 }, { source: 'sci', status: 'ok', count: 24 }], prev).ok, 'small changes pass the volume gate');
ok(!volumeGate([{ source: 'pib', status: 'ok', count: 0 }, { source: 'sci', status: 'ok', count: 25 }], prev).ok, 'a source that falls to zero raises an alert');
ok(!volumeGate([{ source: 'pib', status: 'ok', count: 8 }, { source: 'sci', status: 'ok', count: 25 }], prev).ok, 'a drop of more than half raises an alert');
ok(!volumeGate([{ source: 'pib', status: 'failed', count: 0 }, { source: 'sci', status: 'ok', count: 25 }], prev).ok, 'a failed source raises an alert');
const now = new Date('2026-10-16T12:00:00Z');
ok(freshnessGate('2026-10-16T08:00:00Z', now).ok, 'a file four hours old is fresh');
ok(!freshnessGate('2026-10-14T08:00:00Z', now).ok, 'a file two days old is stale');
ok(!freshnessGate('not a date', now).ok, 'an invalid timestamp is rejected');

console.log('Source gates: combined check');
const good = checkDraft({ draft, reference: REF, referenceTexts: [REF], candidate: { reuse: 'allowed', fact_text: null }, approval, evidence, now });
ok(good.ok && good.failures.length === 0, 'a clean, approved draft from an allowed source passes every gate');
const bad = checkDraft({ draft: REF, reference: REF, referenceTexts: [REF], candidate: { reuse: 'link-only', fact_text: null }, approval: null, evidence: [], now });
ok(!bad.ok && bad.failures.map(f => f.gate).sort().join(',') === 'approval,licence,similarity', 'a copied, link-only, unapproved draft fails three named gates');

console.log(failures() ? `\n✗ ${failures()} gate check(s) failed` : '\n✓ source gate checks passed');
process.exit(failures() ? 1 : 0);
