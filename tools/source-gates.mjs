// Gates for the current-affairs engine (ZC-02 review, Codex Task A). Pure functions, no network, no file writes.
// A gate can block or flag a draft. None of them authorises publication. Publication needs a human approval record
// that is tied to the exact draft and evidence bytes (approvalGate).
//
//   licenceGate      the candidate's reuse flag allows reproduction; "link-only" items never give text
//   similarityGate   a draft shares no long word run and few 5-word shingles with its reference text
//   numberGate       every number and year in the draft appears in the reference text
//   approvalGate     an approval record matches the draft and every evidence text it names, byte for byte
//   volumeGate       per-source counts did not collapse, and no source went silent
//   freshnessGate    the candidate file is recent enough to publish from
import crypto from 'node:crypto';

export const SIMILARITY_LIMITS = { shingle: 5, maxShingleShare: 0.2, maxRunWords: 12 };

export const sha256 = text => crypto.createHash('sha256').update(String(text), 'utf8').digest('hex');

const words = text => String(text).toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim().split(/\s+/).filter(Boolean);

function shingles(list, n) {
  const out = new Set();
  for (let i = 0; i + n <= list.length; i++) out.add(list.slice(i, i + n).join(' '));
  return out;
}

// Longest run of consecutive words that the draft shares with the reference (whole words only).
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
  if (!candidate || candidate.fact_text === undefined) return { ok: false, reason: 'not a candidate record' };
  if (candidate.reuse === 'allowed') return { ok: true, reason: 'reuse allowed by the source record (a hint: the note still needs its own citation)' };
  return { ok: false, reason: `reuse is "${candidate.reuse}": link to the source, do not reproduce its text` };
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
  if (run > limits.maxRunWords) problems.push(`a run of ${run} words matches the reference (limit ${limits.maxRunWords})`);
  return { ok: problems.length === 0, share: Number(share.toFixed(3)), longestRun: run, problems };
}

// Numbers and years in the draft must appear in the reference (commas and spaces inside numbers are ignored).
export function numberGate(draft, reference) {
  const norm = s => String(s).replace(/(\d),(?=\d{2,3}\b)/g, '$1');
  const refNumbers = new Set([...norm(reference).matchAll(/\d+(?:\.\d+)?/g)].map(m => m[0]));
  const missing = [...new Set([...norm(draft).matchAll(/\d+(?:\.\d+)?/g)].map(m => m[0]))].filter(n => !refNumbers.has(n));
  return { ok: missing.length === 0, missing };
}

// The approval must name this exact draft and these exact evidence texts. Any edit after approval fails the gate.
export function approvalGate({ draft, evidence = [], approval }) {
  if (!approval) return { ok: false, problems: ['no approval record'] };
  const problems = [];
  if (!approval.approved_by) problems.push('approved_by is missing');
  if (!approval.approved_at) problems.push('approved_at is missing');
  if (approval.draft_sha256 !== sha256(draft)) problems.push('the draft changed after approval');
  const want = Array.isArray(approval.evidence_sha256) ? approval.evidence_sha256 : [];
  const have = evidence.map(sha256);
  if (want.length !== have.length || want.some((h, i) => h !== have[i])) problems.push('the evidence changed after approval (or a different set was supplied)');
  return { ok: problems.length === 0, problems };
}

// Compare today's per-source counts with the previous file's. Alerts: a source that failed or is empty, a source
// that fell to zero, or a drop of more than half. Input: arrays of { source, status, count }.
export function volumeGate(current, previous = [], { maxDrop = 0.5 } = {}) {
  const alerts = [];
  const before = new Map(previous.map(s => [s.source, s.count]));
  for (const s of current) {
    if (s.status !== 'ok') alerts.push(`${s.source}: status ${s.status}`);
    const prev = before.get(s.source);
    if (prev > 0 && s.count === 0) alerts.push(`${s.source}: fell to zero items (was ${prev})`);
    else if (prev > 0 && s.count < prev * (1 - maxDrop)) alerts.push(`${s.source}: dropped from ${prev} to ${s.count}`);
  }
  return { ok: alerts.length === 0, alerts };
}

// The candidate file must have been generated within maxAgeHours of now.
export function freshnessGate(generatedAt, now = new Date(), maxAgeHours = 24) {
  const t = Date.parse(generatedAt);
  if (!Number.isFinite(t)) return { ok: false, reason: 'generated_at is missing or invalid' };
  const hours = (now.getTime() - t) / 36e5;
  return hours <= maxAgeHours ? { ok: true, hours: Number(hours.toFixed(1)) } : { ok: false, reason: `${hours.toFixed(1)} hours old (limit ${maxAgeHours})` };
}

// Run every gate that applies to one draft. Returns { ok, failures }. Each failure names the gate.
export function checkDraft({ draft, reference, referenceTexts = [], candidate, approval, evidence = [], now = new Date() }) {
  const failures = [];
  const lic = candidate ? licenceGate(candidate) : null;
  if (lic && !lic.ok) failures.push({ gate: 'licence', reason: lic.reason });
  const sim = similarityGate(draft, reference);
  if (!sim.ok) failures.push({ gate: 'similarity', reason: sim.problems.join('; ') });
  const nums = numberGate(draft, referenceTexts.join(' ') || reference);
  if (!nums.ok) failures.push({ gate: 'number', reason: `numbers not in the reference: ${nums.missing.join(', ')}` });
  const appr = approvalGate({ draft, evidence, approval });
  if (!appr.ok) failures.push({ gate: 'approval', reason: appr.problems.join('; ') || appr.reason });
  return { ok: failures.length === 0, failures, checkedAt: now.toISOString() };
}
