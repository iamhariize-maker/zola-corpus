// Gates for the current-affairs engine (ZC-02/ZC-03). Pure functions, no network, no file writes.
// A gate blocks or flags a draft. None of them authorises publication by itself. Publication needs an approval
// record that a named approver signed with a shared secret (approvalGate). Nothing here is wired to a publish path yet.
//
//   licenceGate     the candidate has a recorded rights basis (terms and check date) and its reuse flag allows reproduction
//   similarityGate  no copied run of four or more words, and few 5-word shingles, against the reference text
//   numberGate      every number in the draft appears in the reference together with the same next word
//   approvalGate    an HMAC-signed approval names this exact draft and these exact evidence texts, by a listed approver
//   volumeGate      no source failed, went empty, fell to zero, dropped by half, or is missing from the new pull
//   freshnessGate   the candidate file was generated recently, and not in the future
//   checkDraft      runs every gate that has its inputs and names each failure
import crypto from 'node:crypto';

// No copied run of four or more words. Institution names of two or three words pass.
export const SIMILARITY_LIMITS = { shingle: 5, maxShingleShare: 0.2, maxSharedRun: 3 };
export const MAX_CLOCK_SKEW_MS = 5 * 60 * 1000;

export const sha256 = text => crypto.createHash('sha256').update(String(text), 'utf8').digest('hex');

// Decimals stay one word (5.50 is one token), so a fact with its number is not split into a false copy.
const words = text => String(text).toLowerCase().replace(/(\d)\.(\d)/g, '$1_$2').replace(/[^\p{L}\p{N}_]+/gu, ' ').trim().split(/\s+/).filter(Boolean);

function shingles(list, n) {
  const out = new Set();
  for (let i = 0; i + n <= list.length; i++) out.add(list.slice(i, i + n).join(' '));
  return out;
}

// Longest run of consecutive draft words that appears, whole word for whole word, in the reference.
function longestSharedRun(draft, reference) {
  const ref = ' ' + words(reference).join(' ') + ' ';
  let best = 0;
  for (let i = 0; i < draft.length; i++) {
    let len = 0;
    while (i + len < draft.length && ref.includes(' ' + draft.slice(i, i + len + 1).join(' ') + ' ')) len++;
    if (len > best) best = len;
  }
  return best;
}

export function licenceGate(candidate) {
  if (!candidate) return { ok: false, reason: 'no candidate record' };
  if (candidate.reuse !== 'allowed') return { ok: false, reason: `reuse is "${candidate.reuse}": link to the source, do not reproduce its text` };
  const rights = candidate.rights;
  if (!rights || !rights.terms || !rights.checked_on) return { ok: false, reason: 'no recorded rights basis (terms and check date); the reuse flag alone is not enough' };
  return { ok: true, reason: `rights basis: ${rights.terms} (checked ${rights.checked_on})` };
}

export function similarityGate(draft, reference, limits = SIMILARITY_LIMITS) {
  const d = words(draft);
  const r = words(reference);
  const dShingles = shingles(d, limits.shingle);
  const rShingles = shingles(r, limits.shingle);
  const shared = [...dShingles].filter(s => rShingles.has(s)).length;
  const share = dShingles.size ? shared / dShingles.size : 0;
  const run = longestSharedRun(d, reference);
  const problems = [];
  if (share > limits.maxShingleShare) problems.push(`${Math.round(share * 100)}% of 5-word shingles match the reference (limit ${Math.round(limits.maxShingleShare * 100)}%)`);
  if (run > limits.maxSharedRun) problems.push(`a copied run of ${run} words matches the reference (limit ${limits.maxSharedRun}; reword it)`);
  return { ok: problems.length === 0, share: Number(share.toFixed(3)), longestRun: run, problems };
}

// Each number is checked together with the two words after it, so "298 votes in favour" is not explained by
// "298 votes against". Commas inside a number are ignored (1,000 = 1000).
function numberItems(text) {
  const clean = String(text).replace(/(\d),(?=\d{3}\b)/g, '$1');
  const toks = clean.split(/\s+/);
  const out = [];
  toks.forEach((t, i) => {
    // A currency symbol or dash before the number is stripped; a minus sign stays part of the number.
    const m = t.replace(/^[^\d\s+-]+/, '').match(/^([+-]?\d+(?:\.\d+)?)/);
    if (!m) return;
    const words = toks.slice(i + 1, i + 4).map(w => w.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '')).filter(Boolean).slice(0, 3);
    out.push({ num: m[1], words });
  });
  return out;
}

// A draft number is covered when the reference has the same number followed by the same words, as far as the draft goes.
function covered(item, refItems) {
  return refItems.some(r => r.num === item.num && item.words.every((w, k) => r.words[k] === w));
}

export function numberGate(draft, reference) {
  const refItems = numberItems(reference);
  const missing = [...new Set(numberItems(draft).filter(d => !covered(d, refItems)).map(d => [d.num, ...d.words].join(' ')))];
  return { ok: missing.length === 0, missing };
}

// The approval must be signed by a listed approver with the shared secret, and name this exact draft and these exact
// evidence texts. Any change after approval breaks the signature.
export function approvalSignature(secret, { draft_sha256, evidence_sha256, approved_by, approved_at }) {
  const canonical = [draft_sha256, [...evidence_sha256].join(','), approved_by, approved_at].join('|');
  return crypto.createHmac('sha256', secret).update(canonical, 'utf8').digest('hex');
}

export function approvalGate({ draft, evidence = [], approval, secret, approvers = ['owner'], now = new Date() }) {
  if (!approval) return { ok: false, problems: ['no approval record'] };
  if (!secret) return { ok: false, problems: ['no approval secret configured, so approval cannot be verified'] };
  const problems = [];
  if (!approvers.includes(approval.approved_by)) problems.push(`approved_by "${approval.approved_by}" is not a listed approver`);
  const at = Date.parse(approval.approved_at);
  if (!Number.isFinite(at)) problems.push('approved_at is not a valid timestamp');
  else if (at - now.getTime() > MAX_CLOCK_SKEW_MS) problems.push('approved_at is in the future');
  if (approval.draft_sha256 !== sha256(draft)) problems.push('the draft changed after approval');
  const want = Array.isArray(approval.evidence_sha256) ? approval.evidence_sha256 : [];
  const have = evidence.map(sha256);
  if (want.length !== have.length || want.some((h, i) => h !== have[i])) problems.push('the evidence changed after approval (or a different set was supplied)');
  const expected = approvalSignature(secret, { ...approval, evidence_sha256: want });
  const given = String(approval.signature || '');
  // Fixed-length hex only, checked before the constant-time comparison, so malformed input fails closed.
  if (!/^[0-9a-f]{64}$/i.test(given)) problems.push('the signature is not a 64-character hex value');
  else if (!crypto.timingSafeEqual(Buffer.from(given, 'hex'), Buffer.from(expected, 'hex'))) problems.push('the signature does not verify with the configured secret');
  return { ok: problems.length === 0, problems };
}

// Compare the new pull with the previous one. Alerts: a source that failed or is empty, a source that is missing from
// the new pull, fell to zero, or dropped by more than half. Input: arrays of { source, status, count }.
export function volumeGate(current, previous = [], { maxDrop = 0.5 } = {}) {
  const alerts = [];
  const now = new Map(current.map(s => [s.source, s]));
  for (const s of current) {
    if (s.status !== 'ok') alerts.push(`${s.source}: status ${s.status}`);
  }
  for (const p of previous) {
    const s = now.get(p.source);
    if (!s) { alerts.push(`${p.source}: missing from the new pull (was ${p.count})`); continue; }
    if (p.count > 0 && s.count === 0) alerts.push(`${p.source}: fell to zero items (was ${p.count})`);
    else if (p.count > 0 && s.count < p.count * (1 - maxDrop)) alerts.push(`${p.source}: dropped from ${p.count} to ${s.count}`);
  }
  return { ok: alerts.length === 0, alerts };
}

// The candidate file must have been generated within maxAgeHours, and must not be dated in the future.
export function freshnessGate(generatedAt, now = new Date(), maxAgeHours = 24) {
  const t = Date.parse(generatedAt);
  if (!Number.isFinite(t)) return { ok: false, reason: 'generated_at is missing or invalid' };
  const skew = t - now.getTime();
  if (skew > MAX_CLOCK_SKEW_MS) return { ok: false, reason: 'generated_at is in the future' };
  const hours = (now.getTime() - t) / 36e5;
  return hours <= maxAgeHours ? { ok: true, hours: Number(hours.toFixed(1)) } : { ok: false, reason: `${hours.toFixed(1)} hours old (limit ${maxAgeHours})` };
}

// Run every gate that has its inputs. Missing optional inputs are reported as skipped, never as passed silently.
export function checkDraft({ draft, reference, referenceTexts = [], candidate, approval, approvalSecret, approvers, evidence = [], candidateDoc, previousDoc, now = new Date() }) {
  const failures = [];
  const skipped = [];
  if (candidate) { const r = licenceGate(candidate); if (!r.ok) failures.push({ gate: 'licence', reason: r.reason }); } else skipped.push('licence');
  const sim = similarityGate(draft, reference);
  if (!sim.ok) failures.push({ gate: 'similarity', reason: sim.problems.join('; ') });
  const nums = numberGate(draft, referenceTexts.length ? referenceTexts.join(' ') : reference);
  if (!nums.ok) failures.push({ gate: 'number', reason: `numbers not in the reference with the same next word: ${nums.missing.join(', ')}` });
  const appr = approvalGate({ draft, evidence, approval, secret: approvalSecret, approvers, now });
  if (!appr.ok) failures.push({ gate: 'approval', reason: appr.problems.join('; ') });
  if (candidateDoc) {
    const f = freshnessGate(candidateDoc.generated_at, now);
    if (!f.ok) failures.push({ gate: 'freshness', reason: f.reason });
    if (!previousDoc) failures.push({ gate: 'volume', reason: 'no previous candidate file to compare against, so missing sources and drops cannot be checked' });
    else { const v = volumeGate(candidateDoc.sources || [], previousDoc.sources || []); if (!v.ok) failures.push({ gate: 'volume', reason: v.alerts.join('; ') }); }
  } else skipped.push('freshness', 'volume');
  return { ok: failures.length === 0, failures, skipped, checkedAt: now.toISOString() };
}
