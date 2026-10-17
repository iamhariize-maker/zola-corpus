// Source gates (ZC-02/ZC-03): every gate on synthetic text, including each bypass named in Codex's ZC-03 review.
// No network, no files.
import { ok, failures } from './helpers.mjs';
import {
  licenceGate, similarityGate, numberGate, approvalGate, approvalSignature, volumeGate, freshnessGate, checkDraft, sha256,
} from '../tools/source-gates.mjs';

const REF = 'The Monetary Policy Committee voted unanimously to increase the policy repo rate by 25 basis points to 5.50 per cent. Two members wanted the stance to stay neutral.';
const OWN = 'The rate moved up a quarter point, now standing at 5.50 per cent, and the vote was unanimous.';
const SECRET = 'test-secret-not-real';
const NOW = new Date('2026-10-16T12:00:00Z');

console.log('Source gates: licence (reuse flag alone is not enough)');
const rights = { terms: 'https://pib.gov.in/Content/102_2_Copyright-Policy.aspx', checked_on: '2026-10-16' };
ok(licenceGate({ reuse: 'allowed', rights }).ok, 'an allowed source with a recorded rights basis passes');
ok(!licenceGate({ reuse: 'allowed', rights: null }).ok, '"allowed" with no rights basis is blocked (Codex bypass: the flag alone passed)');
ok(!licenceGate({ reuse: 'allowed', rights: { terms: rights.terms } }).ok, 'a rights basis without a check date is blocked');
ok(!licenceGate({ reuse: 'link-only', rights }).ok, 'a link-only source is blocked from reproducing text');
ok(!licenceGate(null).ok, 'a missing record is blocked');

console.log('Source gates: similarity');
ok(!similarityGate(REF, REF).ok, 'a verbatim copy is blocked');
ok(similarityGate(OWN, REF).ok, 'the same facts in our own words pass');
ok(!similarityGate('The Monetary Policy Committee voted unanimously to raise the rate.', REF).ok, 'an exact four-word copy is blocked (Codex bypass: four words passed)');
ok(similarityGate('Monetary Policy Committee members met in October.', REF).ok, 'a three-word institution name passes');
ok(similarityGate('the rate is now 5.50 per cent, set by the committee', 'the committee set the rate at 5.50 per cent today').longestRun === 3, "a decimal is one word, so 5.50 per cent is a three-word run");
ok(similarityGate('cattle grazing near fields', 'cat sat on mats').longestRun === 0, 'matching is by whole words, not substrings');

console.log('Source gates: numbers (value and meaning)');
ok(numberGate('the repo rate is 5.50 per cent', REF).ok, 'a number with the same next word passes');
ok(!numberGate('the repo rate is 6.00 per cent', REF).ok, 'a number missing from the reference is flagged');
ok(!numberGate('298 votes were cast', '298 members voted for and 230 members against').ok, 'a number with the wrong meaning is flagged (Codex bypass: 298 votes vs 298 members)');
ok(numberGate('230 members against', '298 members voted for and 230 members against').ok, 'the same number with the same meaning passes');
ok(!numberGate('298 votes in favour', '298 votes against; 230 votes in favour').ok, 'a reversed vote direction is flagged (Codex bypass: the number alone passed)');
ok(!numberGate('298 votes in favour', '298 votes in opposition; 230 votes in favour').ok, 'a vote direction reversed by a different word is flagged (Sol bypass)');
ok(!numberGate('₹99 lakh crore', '₹53.47 lakh crore').ok, 'a currency amount with a different value is flagged (Sol bypass)');
ok(!numberGate('-5 per cent', '5 per cent').ok, 'a number whose sign differs is flagged (Sol bypass)');
ok(!numberGate('−5 per cent', '5 per cent').ok, 'a Unicode minus differs from a plain number (Sol bypass)');
ok(!numberGate('2026-10-17', '2026-09-01').ok, 'an ISO date with a different day and month is flagged (Sol bypass)');
ok(!numberGate('25–37 judges', '25–33 judges').ok, 'a range with a different upper bound is flagged (Sol bypass)');
ok(!numberGate('5% growth', '5 growth').ok, 'a percent unit omitted from the reference is flagged (Sol bypass)');
ok(numberGate('5% growth', '5% growth').ok, 'the same percent figure with the same unit passes');
ok(!numberGate('₹5 lakh crore', '$5 lakh crore').ok, 'a currency change with the same digit is flagged (Codex bypass)');
ok(!numberGate('298 votes cast in favour', '298 votes cast in opposition').ok, 'a direction word beyond the old window is flagged (Codex bypass)');
ok(!numberGate('10^12 days', '10 days').ok, 'an unsupported number form fails closed for review (Codex)');
ok(numberGate('(5 per cent)', 'the rate is 5 per cent.').ok, 'a number inside brackets with the same unit passes');
ok(!numberGate('€99 million', '€53 million').ok, 'a euro figure the gate does not parse fails closed (Sol bypass)');
ok(!numberGate('~99 million', '99 million').ok, 'an approximate figure fails closed (Sol bypass)');
ok(!numberGate('₹(99) crore', '₹53 crore').ok, 'a currency with brackets fails closed (Sol bypass)');
ok(!numberGate('298 votes cast in one long list of words that continue for a while and the final word is favour.', '298 votes cast in one long list of words that continue for a while and the final word is opposition.').ok, 'a direction word late in the clause is still compared (Sol bypass)');
ok(numberGate('a total of 1,000 lakh', 'the total was 1000 lakh').ok, 'digit grouping with commas is ignored');
ok(numberGate('in 2026', 'in 2026').ok && !numberGate('in 2027', 'in 2026').ok, 'years are checked like other numbers');
ok(!numberGate('- 5 per cent', '5 per cent').ok, 'a detached minus sign before a value fails closed (Sol bypass)');
ok(!numberGate('USD about 5 million', 'INR about 5 million').ok, 'a currency kept across "about" is compared (Sol bypass)');
ok(numberGate('USD about 5 million', 'USD about 5 million').ok, 'the same currency across "about" passes');
ok(!numberGate('₹९९ crore', '₹५३ crore').ok, 'Devanagari digits fail closed, not ignored (Sol bypass)');
ok(numberGate('5. The answer is yes.', '5. The answer is no.').ok, 'a sentence after a number that ends in a period is not compared (Sol bypass)');
ok(numberGate('5 per cent." The answer is yes.', '5 per cent." The answer is no.').ok, 'a number before a closing quote stops at its clause end (Sol bypass)');
ok(!numberGate('5 per cent is the rate, not 5 per cent. Votes: 298 in favour', '5 per cent is the rate, not 5 per cent. Votes: 298 against').ok, 'a number after a sentence break is compared with its own clause, not skipped');

console.log('Source gates: approval (signed, named, bound, and timely)');
const draft = 'Our note on the repo rate.';
const evidence = ['page one text', 'page two text'];
const base = { approved_by: 'owner', approved_at: '2026-10-16T11:00:00Z', draft_sha256: sha256(draft), evidence_sha256: evidence.map(sha256) };
const approval = { ...base, signature: approvalSignature(SECRET, base) };
const g = (a, extra = {}) => approvalGate({ draft, evidence, approval: a, secret: SECRET, now: NOW, ...extra });
ok(g(approval).ok, 'a signed approval by a listed approver, bound to this draft and evidence, passes');
ok(!approvalGate({ draft, evidence, approval, secret: null, now: NOW }).ok, 'no secret configured means approval cannot be verified');
ok(!g({ ...approval, signature: 'forged' }).ok, 'a forged signature fails');
ok(!g({ ...approval, approved_by: 'someone', signature: approvalSignature(SECRET, { ...base, approved_by: 'someone' }) }).ok, 'an approver who is not listed fails, even with a valid signature for that name');
ok(!g({ ...approval, approved_at: '2026-10-16T13:00:00Z' }).ok, 'a changed timestamp breaks the signature');
ok(!g(approval, { draft: draft + ' edited' }).ok, 'an edit after approval fails');
ok(!g(approval, { evidence: ['page one text', 'changed'] }).ok, 'changed evidence fails');
ok(!g({ ...approval, approved_at: 'not a date' }).ok, 'an invalid timestamp fails');
ok(!g({ ...approval, approved_at: '2026-10-17T12:00:00Z' }).ok, 'a timestamp in the future fails');
ok(!g(null).ok, 'no approval record fails');
ok(!g({ ...approval, signature: '\u{1F600}'.repeat(32) }).ok, 'a 32-emoji signature fails closed instead of throwing (Codex bypass)');

console.log('Source gates: volume (missing sources and collapses)');
const prev = [{ source: 'pib', status: 'ok', count: 20 }, { source: 'sci', status: 'ok', count: 25 }];
ok(volumeGate([{ source: 'pib', status: 'ok', count: 19 }, { source: 'sci', status: 'ok', count: 24 }], prev).ok, 'small changes pass');
ok(!volumeGate([{ source: 'pib', status: 'ok', count: 20 }], prev).ok, 'a source missing from the new pull fails (Codex bypass)');
ok(!volumeGate([{ source: 'pib', status: 'ok', count: 0 }, { source: 'sci', status: 'ok', count: 25 }], prev).ok, 'a source that falls to zero raises an alert');
ok(!volumeGate([{ source: 'pib', status: 'ok', count: 8 }, { source: 'sci', status: 'ok', count: 25 }], prev).ok, 'a drop of more than half raises an alert');
ok(!volumeGate([{ source: 'pib', status: 'failed', count: 0 }, { source: 'sci', status: 'ok', count: 25 }], prev).ok, 'a failed source raises an alert');

console.log('Source gates: freshness');
ok(freshnessGate('2026-10-16T08:00:00Z', NOW).ok, 'a file four hours old is fresh');
ok(!freshnessGate('2026-10-14T08:00:00Z', NOW).ok, 'a file two days old is stale');
ok(!freshnessGate('2026-10-16T20:00:00Z', NOW).ok, 'a file dated in the future is rejected (Codex bypass)');
ok(!freshnessGate('not a date', NOW).ok, 'an invalid timestamp is rejected');

console.log('Source gates: combined check runs freshness and volume when given');
const candidateDoc = { generated_at: '2026-10-16T08:00:00Z', sources: prev };
const good = checkDraft({ draft, reference: REF, referenceTexts: [REF], candidate: { reuse: 'allowed', rights }, approval, approvalSecret: SECRET, evidence, candidateDoc, previousDoc: { sources: prev }, now: NOW });
ok(good.ok && good.failures.length === 0 && good.skipped.length === 0, 'a clean, signed, fresh draft passes every gate and skips nothing');
const stale = checkDraft({ draft, reference: REF, candidate: { reuse: 'allowed', rights }, approval, approvalSecret: SECRET, evidence, candidateDoc: { generated_at: '2026-10-10T08:00:00Z', sources: prev }, previousDoc: { sources: prev }, now: NOW });
ok(!stale.ok && stale.failures.some(f => f.gate === 'freshness'), 'the combined check fails on a stale candidate file');
const noBaseline = checkDraft({ draft, reference: REF, candidate: { reuse: 'allowed', rights }, approval, approvalSecret: SECRET, evidence, candidateDoc, now: NOW });
ok(!noBaseline.ok && noBaseline.failures.some(f => f.gate === 'volume'), 'a fresh candidate with no baseline fails the volume gate, not a silent pass (Codex bypass)');
const missing = checkDraft({ draft, reference: REF, candidate: { reuse: 'allowed', rights }, approval, approvalSecret: SECRET, evidence, candidateDoc: { generated_at: '2026-10-16T08:00:00Z', sources: [prev[0]] }, previousDoc: { sources: prev }, now: NOW });
ok(!missing.ok && missing.failures.some(f => f.gate === 'volume'), 'the combined check fails when a source is missing');
const bad = checkDraft({ draft: REF, reference: REF, referenceTexts: [REF], candidate: { reuse: 'link-only' }, approval: null, evidence: [], now: NOW });
ok(!bad.ok && bad.failures.map(f => f.gate).sort().join(',') === 'approval,licence,similarity', 'a copied, link-only, unapproved draft fails three named gates');
ok(bad.skipped.includes('freshness') && bad.skipped.includes('volume'), 'gates without inputs are reported as skipped, not passed');

console.log(failures() ? `\n✗ ${failures()} gate check(s) failed` : '\n✓ source gate checks passed');
process.exit(failures() ? 1 : 0);
