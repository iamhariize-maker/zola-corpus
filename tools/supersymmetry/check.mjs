#!/usr/bin/env node
// Supersymmetry checks. No dependencies.
//   node scripts/check.mjs                                  this repository's canonical files
//   node scripts/check.mjs ledger <file> [--today=DATE]     an acceptance ledger; --today judges leases
//   node scripts/check.mjs binding <file>                   a project binding
//   node scripts/check.mjs message <file>                   one channel message
//   node scripts/check.mjs channel <file> [cards-dir] [--owner=ID]
//                                                           a JSON array of messages in posting order; with
//                                                           cards-dir, each author must be the active card's account
//   node scripts/check.mjs card <file>                      one lane card
//   node scripts/check.mjs cards <dir> <binding-file>       every card, with its route checked against Allowed routes
// Exit code 0 when clean, 1 when there are problems, 2 for bad usage or an unreadable file.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const PROTOCOL_VERSION = '5.1.0';
export const MAX_HOP = 6;

export const LEDGER_COLUMNS = [
  'Task', 'Requirement', 'Actual models', 'Baseline', 'Claimed paths', 'Design / experiment',
  'Implementation SHA', 'Independent findings', 'Integration SHA', 'Exact-head evidence',
  'Remaining gap', 'Next owner / action',
];

export const STATUSES = [
  'posted', 'acknowledged', 'claimed', 'implemented', 'reviewed', 'integrated', 'verified', 'blocked',
];

export const VERDICTS = ['accept', 'revise', 'blocked'];

export const BINDING_FIELDS = [
  'Protocol version', 'Project', 'Repository', 'Default branch', 'Lane branches',
  'Live lanes and tiers', 'Reply paths', 'Acceptance ledger', 'Channel',
  'Current primary objective', 'Required checks', 'Integration owner and rule',
  'Post-integration runs', 'Provider policy', 'Allowed routes', 'Lane identity', 'Budget', 'Safeguards',
];

// The Required checks field must run each of these. The ledger check must also judge leases.
// Every project runs the ledger check with a lease date. A project whose lanes have separate GitHub identities
// also runs the cards check. A declared shared identity project does not, and must say so in its Safeguards.
export const REQUIRED_CHECK_COMMANDS = ['check.mjs ledger', '--today='];
export const SEPARATED_CHECK_COMMAND = 'check.mjs cards';
export const IDENTITY_MODES = ['separated', 'declared shared'];

export const MESSAGE_FIELDS = ['id', 'from', 'to', 'in-reply-to', 'task', 'sha', 'hop', 'reply-wanted'];
export const OPTIONAL_MESSAGE_FIELDS = ['act', 'reply-by', 'verdict'];
export const ACTS = ['cfp', 'propose', 'accept', 'reject', 'refuse', 'inform', 'failure', 'cancel'];

export const TIERS = ['expert', 'worker', 'specialist'];
export const CARD_FIELDS = [
  'sender_identity', 'github_user_id', 'github_login', 'runtime', 'provider_route', 'tier', 'models',
  'scopes', 'rule_of_two', 'budget', 'status',
];
export const OPTIONAL_CARD_FIELDS = ['skills', 'known_failure_modes'];
export const SERVED_SOURCES = ['runtime-report', 'provider-response', 'UNREPORTED'];
export const EXTERNAL_ACTIONS = ['none', 'lane-branch-only', 'default-branch'];
export const EGRESS = ['none', 'allowlist', 'unrestricted'];
export const RULE_FLAGS = [
  'reads_untrusted', 'holds_sensitive', 'holds_provider_key', 'holds_repository_write_token', 'holds_actions_secrets',
];

export const PROTOCOL_HEADINGS = [
  '## 1. Scope', '## 2. Precedence and non-waivable rules', '## 3. Lanes, tiers and sender identity',
  '## 4. Work loop', '## 5. Claims, leases and overlap', '## 6. Integration gates', '## 7. Status vocabulary',
  '## 8. Single acceptance ledger', '## 9. Channel messages', '## 10. Safeguards',
  '## 11. Disagreement and escalation', '## 12. Owner decisions', '## 13. Evolving this protocol',
  '## 14. Adopting', '## 15. Swarm extension',
];

export const REQUIRED_DOCS = [
  'docs/SWARM.md', 'docs/SECURITY.md', 'docs/RUNTIMES.md', 'docs/RESEARCH.md', 'docs/FAMILY.md',
  'docs/DECISIONS.md', 'docs/MEASURES.md', 'schemas/agent-card.schema.json', '.github/CODEOWNERS',
];

const FULL_SHA = /^[0-9a-f]{40}$/;
const SENDER = /^[a-z][a-z0-9-]*$/;
const MESSAGE_ID = /^([a-z][a-z0-9-]*)-(\d{3,})$/;
const GITHUB_LOGIN = /^[A-Za-z0-9-]+(\[bot\])?$/;
const PLACEHOLDER = /<[A-Za-z][^<>\n]*>/;
const CLAIM_COLUMNS = ['Independent findings', 'Integration SHA', 'Exact-head evidence'];
const CLAIM_WORDS = /\b(deployed|live|shipped|scheduled run verified)\b/i;
const EVIDENCE = /\b(run:\d+|artifact:\S+)/;
const LEASES = /lease until (\d{4}-\d{2}-\d{2})/g;

const normalise = (text) => text.replace(/\r\n?/g, '\n');
const isFullSha = (value) => typeof value === 'string' && FULL_SHA.test(value);
const isText = (value) => typeof value === 'string' && value.length > 0;
const startsWithNone = (value) => /^none\b/i.test(value ?? '');

// A real calendar date, so that 2026-02-30 and 9999-99-99 are rejected.
export function isDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const time = Date.parse(`${value}T00:00:00Z`);
  return !Number.isNaN(time) && new Date(time).toISOString().slice(0, 10) === value;
}

// An accept counts only if it is not negated and names the full SHA in the same cell.
const acceptsSha = (findings, sha) => new RegExp(`(?<!\\b(?:not|cannot|never|no) )\\baccept\\b[^|]*${sha}`).test(findings);

// Ledger

const splitRow = (line) => line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((cell) => cell.trim());

// The first contiguous block of table lines is the ledger. Any other table line is reported, not skipped.
function firstTable(lines) {
  const start = lines.findIndex((line) => line.trim().startsWith('|'));
  if (start < 0) return [];
  const rows = [];
  for (let index = start; index < lines.length && lines[index].trim().startsWith('|'); index += 1) {
    rows.push(lines[index]);
  }
  return rows;
}

function statusProblems(status, value) {
  const problems = [];
  const implementation = value('Implementation SHA');
  const findings = value('Independent findings');
  const models = value('Actual models');
  if (['implemented', 'reviewed', 'integrated', 'verified'].includes(status) && !isFullSha(implementation)) {
    problems.push(`${status} needs a full Implementation SHA`);
  }
  if (['reviewed', 'integrated', 'verified'].includes(status)) {
    if (!isFullSha(implementation) || !acceptsSha(findings, implementation)) {
      problems.push(`${status} needs Independent findings to say "accept" and name the full Implementation SHA`);
    }
    if (!/author family:/i.test(models) || !/verifier family:/i.test(models)) {
      problems.push(`${status} needs "author family:" and "verifier family:" in Actual models`);
    }
  }
  if (['integrated', 'verified'].includes(status) && !isFullSha(value('Integration SHA'))) {
    problems.push(`${status} needs a full Integration SHA`);
  }
  if (status === 'verified' && !EVIDENCE.test(value('Exact-head evidence'))) {
    problems.push('verified needs run:<digits> or artifact:<ref> in Exact-head evidence');
  }
  return problems;
}

function checkLedgerRow(cells, label, today) {
  if (cells.length !== LEDGER_COLUMNS.length) {
    return [`${label}: ${cells.length} cells, expected ${LEDGER_COLUMNS.length}`];
  }
  const value = (column) => cells[LEDGER_COLUMNS.indexOf(column)];
  const problems = cells
    .map((cell, column) => (cell ? null : `${label}: ${LEDGER_COLUMNS[column]} is empty`))
    .filter(Boolean);
  const status = value('Task').match(/\(([a-z]+)\)$/)?.[1];
  if (!STATUSES.includes(status)) {
    return [...problems, `${label}: Task must end with a status in parentheses (${STATUSES.join(', ')})`];
  }
  for (const column of ['Implementation SHA', 'Integration SHA']) {
    const cell = value(column);
    if (!isFullSha(cell) && cell !== 'none' && cell !== 'pending') {
      problems.push(`${label}: ${column} must be one full 40-character SHA, none or pending`);
    }
  }
  const models = value('Actual models');
  if (!/\brequested:/i.test(models) || !/\bserved:/i.test(models) || !/source:/i.test(models)) {
    problems.push(`${label}: Actual models must record the requested and the served model, each with its source`);
  }
  if (/served:\s*UNREPORTED/i.test(models) !== /source:\s*UNREPORTED/i.test(models)) {
    problems.push(`${label}: served UNREPORTED and source UNREPORTED must agree`);
  }
  if (status === 'claimed') {
    const leases = [...value('Claimed paths').matchAll(LEASES)].map((match) => match[1]);
    if (leases.length === 0) problems.push(`${label}: a claimed row needs "lease until YYYY-MM-DD" in Claimed paths`);
    for (const lease of leases) {
      if (!isDate(lease)) {
        problems.push(`${label}: lease until ${lease} is not a real date`);
      } else if (today && lease < today) {
        problems.push(`${label}: lease until ${lease} has lapsed; renew it or release the claim`);
      }
    }
  }
  problems.push(...statusProblems(status, value).map((problem) => `${label}: ${problem}`));
  const evidence = value('Exact-head evidence');
  for (const column of CLAIM_COLUMNS) {
    if (CLAIM_WORDS.test(value(column)) && !EVIDENCE.test(evidence)) {
      problems.push(`${label}: a deployed, live, shipped or scheduled-run claim in ${column} needs run:<digits> or artifact:<ref> in Exact-head evidence`);
    }
  }
  return problems;
}

export function checkLedger(text, { today } = {}) {
  const lines = normalise(text).split('\n');
  const rows = firstTable(lines);
  if (rows.length === 0) return ['ledger has no table'];
  const problems = [];
  if (lines.filter((line) => line.trim().startsWith('|')).length > rows.length) {
    problems.push('table lines outside the first table; keep one table in the ledger');
  }
  if (splitRow(rows[0]).join(' | ') !== LEDGER_COLUMNS.join(' | ')) {
    problems.push('header must be the 12 ledger columns, in protocol order');
  }
  const separator = rows.length > 1 ? splitRow(rows[1]) : [];
  if (separator.length !== LEDGER_COLUMNS.length || !separator.every((cell) => /^:?-{3,}:?$/.test(cell))) {
    // Without a valid separator the second line may be a data row, so stop here rather than skip it.
    return [...problems, `separator row must have ${LEDGER_COLUMNS.length} cells of dashes`];
  }
  const dataRows = rows.slice(2);
  if (dataRows.length === 0) return [...problems, 'ledger has no task rows'];
  dataRows.forEach((line, index) => problems.push(...checkLedgerRow(splitRow(line), `row ${index + 1}`, today)));
  return problems;
}

// Binding

export function bindingFields(text) {
  const fields = new Map();
  let current = null;
  for (const line of normalise(text).split('\n')) {
    const start = line.match(/^- \*\*(.+?):\*\*(.*)$/);
    if (start) {
      current = start[1];
      fields.set(current, start[2].trim());
    } else if (/^(## |- \*\*)/.test(line)) {
      current = null;
    } else if (current && line.trim()) {
      fields.set(current, `${fields.get(current)} ${line.trim()}`.trim());
    }
  }
  return fields;
}

export function checkBinding(text, { allowPlaceholders = false } = {}) {
  const problems = [];
  if (!/^## Project binding$/m.test(normalise(text))) problems.push('missing "## Project binding" heading');
  const fields = bindingFields(text);
  const field = (name) => fields.get(name) ?? '';
  for (const name of BINDING_FIELDS) {
    if (!field(name)) {
      problems.push(`missing or empty field: ${name}`);
    } else if (!allowPlaceholders && PLACEHOLDER.test(field(name))) {
      problems.push(`placeholder left in field: ${name}`);
    }
  }
  if (field('Protocol version') && field('Protocol version') !== PROTOCOL_VERSION) {
    problems.push(`Protocol version must be ${PROTOCOL_VERSION}, the version this checker implements`);
  }
  const identity = field('Lane identity');
  const separated = /^separated\b/i.test(identity);
  if (identity && !IDENTITY_MODES.some((mode) => identity.toLowerCase().startsWith(mode))) {
    problems.push('Lane identity must start with "separated" or "declared shared"');
  }
  if (/^declared shared\b/i.test(identity) && !/shared/i.test(field('Safeguards'))) {
    problems.push('Safeguards must say that channel authority is the owner\'s login, because the lane identity is declared shared');
  }
  if (/^declared shared\b/i.test(identity) && !/until \d{4}-\d{2}-\d{2}/.test(identity)) {
    problems.push('a declared shared identity must name its exit date, "until YYYY-MM-DD"');
  }
  const requiredChecks = field('Required checks');
  if (requiredChecks.includes('/path/to/')) {
    problems.push('Required checks still has the placeholder path /path/to/; copy the checker into the project and name its path');
  }
  if (startsWithNone(requiredChecks)) {
    problems.push('Required checks cannot be none');
  } else if (requiredChecks) {
    for (const command of separated ? [...REQUIRED_CHECK_COMMANDS, SEPARATED_CHECK_COMMAND] : REQUIRED_CHECK_COMMANDS) {
      if (!requiredChecks.includes(command)) problems.push(`Required checks must include "${command}"`);
    }
    const ledgerInChecks = requiredChecks.match(/check\.mjs ledger (\S+)/)?.[1]?.replace(/;$/, '');
    const ledgerField = field('Acceptance ledger').split(/\s+/)[0];
    if (!allowPlaceholders && ledgerInChecks && ledgerField && ledgerInChecks !== ledgerField) {
      problems.push('Required checks must check the ledger named in Acceptance ledger');
    }
  }
  if (startsWithNone(field('Post-integration runs')) && !/no workflows exist/i.test(field('Post-integration runs'))) {
    problems.push('Post-integration runs must name the workflows, or say "none: no workflows exist"');
  }
  if (startsWithNone(field('Provider policy'))) problems.push('Provider policy cannot be none');
  if (startsWithNone(field('Allowed routes'))) {
    problems.push('Allowed routes cannot be none; list each provider route, separated by semicolons');
  }
  if (startsWithNone(field('Budget'))) problems.push('Budget cannot be none; state a cap per task');
  if (field('Budget') && !/tokens|turns/i.test(field('Budget'))) {
    problems.push('Budget must state a measurable cap in tokens or turns; lanes do not report USD');
  }
  if (startsWithNone(field('Safeguards'))) problems.push('Safeguards cannot be none');
  return problems;
}

// Channel messages

export function parseHeader(text) {
  const lines = normalise(text).split('\n');
  let index = 0;
  while (index < lines.length && (lines[index].trim() === '' || lines[index].trim().startsWith('```'))) {
    index += 1;
  }
  const header = Object.create(null);
  for (; index < lines.length; index += 1) {
    const line = lines[index];
    if (line.trim() === '' || line.trim().startsWith('```')) break;
    const match = line.match(/^([a-z][a-z-]*):\s*(.*)$/);
    if (!match) return { error: `not a header line: ${line}` };
    if (match[1] in header) return { error: `duplicate header key: ${match[1]}` };
    header[match[1]] = match[2].trim();
  }
  return header;
}

function checkHeader(header) {
  const missing = MESSAGE_FIELDS.filter((field) => !header[field]);
  if (missing.length) return missing.map((field) => `missing header field: ${field}`);
  const problems = [];
  if (!SENDER.test(header.from)) problems.push('from must be a sender identity such as claude-worker or codex-expert');
  const id = header.id.match(MESSAGE_ID);
  if (!id) {
    problems.push('id must be <from>-<nnn>, for example codex-expert-012');
  } else if (id[1] !== header.from) {
    problems.push('id prefix must match the from sender');
  }
  if (!(header.to === 'all' || SENDER.test(header.to))) problems.push('to must be a sender identity, or all');
  if (header.to === 'all' && header.from !== 'owner') problems.push('only the owner broadcasts (to: all)');
  if (header['in-reply-to'] !== 'none' && !MESSAGE_ID.test(header['in-reply-to'])) {
    problems.push('in-reply-to must be none or an id');
  }
  if (header.sha !== 'none' && !isFullSha(header.sha)) problems.push('sha must be one full 40-character SHA, or none');
  if (!/^[1-9]\d*$/.test(header.hop) || Number(header.hop) > MAX_HOP) {
    problems.push(`hop must be a whole number from 1 to ${MAX_HOP}`);
  }
  if (!['yes', 'no'].includes(header['reply-wanted'])) problems.push('reply-wanted must be yes or no');
  if (header.act !== undefined && !ACTS.includes(header.act)) problems.push(`act must be one of ${ACTS.join(', ')}`);
  if (header['reply-by'] !== undefined && !isDate(header['reply-by'])) problems.push('reply-by must be a real date, YYYY-MM-DD');
  if (header.verdict !== undefined && !VERDICTS.includes(header.verdict)) {
    problems.push(`verdict must be one of ${VERDICTS.join(', ')}`);
  }
  if ((header.act === 'accept' || header.verdict === 'accept') && !isFullSha(header.sha)) {
    problems.push('an accept names the full SHA it covers, so sha must be a full SHA');
  }
  return problems;
}

export function checkMessage(text) {
  const header = parseHeader(text);
  return header.error ? [header.error] : checkHeader(header);
}

export function findDuplicateIds(headers) {
  const seen = new Map();
  for (const header of headers) seen.set(header.id, (seen.get(header.id) ?? 0) + 1);
  return [...seen].filter(([, count]) => count > 1).map(([id]) => id);
}

function normaliseItem(item) {
  if (typeof item === 'string') return { body: item };
  if (item === null || typeof item !== 'object') return { invalid: true };
  return {
    body: typeof item.body === 'string' ? item.body : '',
    authorId: item.author_id,
    authorLogin: item.author_login,
    editedBy: item.edited_by,
  };
}

// Authority comes from the authenticated account, by numeric user ID. Logins can be renamed, so they are
// for display only. A message counts only as its author's own: an edit by another account voids it.
function authorProblems(label, sender, item, cards, owner) {
  const expected = sender === 'owner' ? owner : cards[sender];
  if (expected === undefined) {
    return sender === 'owner'
      ? [`${label}: owner messages need the owner's numeric ID (--owner=ID)`]
      : [`${label}: no active lane card for sender ${sender}`];
  }
  if (item.authorId === undefined || item.authorId === null || item.authorId === '') {
    return [`${label}: author_id missing; authority comes from the authenticated account`];
  }
  if (String(item.authorId) !== String(expected)) {
    const who = typeof item.authorLogin === 'string' ? item.authorLogin : String(item.authorId);
    return [`${label}: author ${who} is not the account for ${sender}`];
  }
  if (item.editedBy !== undefined && item.editedBy !== null && String(item.editedBy) !== String(item.authorId)) {
    return [`${label}: edited by another account; a message counts only as its author's own`];
  }
  return [];
}

// Checks the whole channel in posting order: header validity, authors (when cards are given), unique and
// rising IDs per sender, and hop counts per task. Tree identity cannot be checked from the text; a reviewer does it.
export function checkChannel(items, { cards, owner } = {}) {
  const problems = [];
  const messages = [];
  items.forEach((raw, index) => {
    const label = `message ${index + 1}`;
    const item = normaliseItem(raw);
    if (item.invalid) {
      problems.push(`${label}: not a message`);
      return;
    }
    const header = parseHeader(item.body);
    if (header.error) {
      problems.push(`${label}: ${header.error}`);
      return;
    }
    const found = checkHeader(header);
    if (found.length) {
      problems.push(...found.map((problem) => `${label}: ${problem}`));
      return;
    }
    if (cards) problems.push(...authorProblems(label, header.from, item, cards, owner));
    messages.push({ label, header });
  });
  const lastNumber = new Map();
  for (const { label, header } of messages) {
    const number = Number(header.id.match(MESSAGE_ID)[2]);
    if (lastNumber.has(header.from) && number <= lastNumber.get(header.from)) {
      problems.push(`${label}: ${header.id} is not higher than ${header.from}'s previous number`);
    }
    lastNumber.set(header.from, number);
  }
  for (const id of findDuplicateIds(messages.map(({ header }) => header))) {
    problems.push(`duplicate id ${id}`);
  }
  const tasks = new Map();
  for (const { label, header } of messages) {
    const state = tasks.get(header.task) ?? { hop: 0, cited: new Set() };
    const newSha = header.sha !== 'none' && !state.cited.has(header.sha);
    const expected = newSha ? 1 : state.hop + 1;
    if (Number(header.hop) !== expected) {
      problems.push(`${label}: hop is ${header.hop} on task ${header.task}, expected ${expected}`);
    }
    if (header.sha !== 'none') state.cited.add(header.sha);
    tasks.set(header.task, { hop: expected, cited: state.cited });
  }
  return problems;
}

// Lane cards

export function checkCard(card) {
  if (!card || typeof card !== 'object' || Array.isArray(card)) return ['card must be a JSON object'];
  const missing = CARD_FIELDS.filter((field) => card[field] === undefined);
  if (missing.length) return missing.map((field) => `missing field: ${field}`);
  const problems = Object.keys(card)
    .filter((key) => ![...CARD_FIELDS, ...OPTIONAL_CARD_FIELDS].includes(key))
    .map((key) => `unknown field: ${key}`);
  if (!isText(card.sender_identity) || !SENDER.test(card.sender_identity)) {
    problems.push('sender_identity must be lowercase and hyphenated, for example codex-expert');
  }
  if (!Number.isInteger(card.github_user_id) || card.github_user_id < 1) {
    problems.push('github_user_id must be a positive integer; logins can be renamed, IDs cannot');
  }
  if (!isText(card.github_login) || !GITHUB_LOGIN.test(card.github_login)) {
    problems.push('github_login must be a GitHub login, optionally a [bot] login');
  }
  if (!TIERS.includes(card.tier)) problems.push(`tier must be one of ${TIERS.join(', ')}`);
  if (!['active', 'paused', 'retired'].includes(card.status)) problems.push('status must be active, paused or retired');
  if (!isText(card.runtime?.name) || !isText(card.runtime?.version) || !isText(card.runtime?.invocation)) {
    problems.push('runtime needs name, version and invocation');
  }
  if (!isText(card.provider_route)) problems.push('provider_route must name the route, for example direct:<provider>');
  const models = card.models ?? {};
  if (!isText(models.requested)) problems.push('models.requested is required');
  if (!SERVED_SOURCES.includes(models.served_source)) {
    problems.push(`models.served_source must be one of ${SERVED_SOURCES.join(', ')}`);
  }
  if (!isText(models.served)) problems.push('models.served is required; use UNREPORTED if it was not observed');
  if ((models.served_source === 'UNREPORTED') !== (models.served === 'UNREPORTED')) {
    problems.push('served and served_source must agree on UNREPORTED');
  }
  const scopes = card.scopes ?? {};
  for (const list of ['repositories', 'paths', 'branches', 'tools']) {
    if (!Array.isArray(scopes[list])) problems.push(`scopes.${list} must be a list`);
  }
  if (!isText(scopes.sandbox)) problems.push('scopes.sandbox must be a non-empty string, such as read-only');
  const rule = card.rule_of_two ?? {};
  for (const flag of RULE_FLAGS) {
    if (typeof rule[flag] !== 'boolean') problems.push(`rule_of_two.${flag} must be true or false`);
  }
  if (!EXTERNAL_ACTIONS.includes(rule.external_action)) {
    problems.push(`rule_of_two.external_action must be one of ${EXTERNAL_ACTIONS.join(', ')}`);
  }
  if (rule.external_action === 'default-branch') {
    problems.push('external_action cannot be default-branch: integration is a separate gate (security C5)');
  }
  if (!EGRESS.includes(rule.egress)) problems.push(`rule_of_two.egress must be one of ${EGRESS.join(', ')}`);
  if (rule.holds_repository_write_token === true) {
    problems.push('a lane never holds a repository write token; writes go through the git proxy (security C3)');
  }
  if (rule.holds_actions_secrets === true) {
    problems.push('a lane never holds repository Actions secrets (security C3)');
  }
  if ((rule.holds_sensitive === true || rule.reads_untrusted === true) && rule.egress === 'unrestricted') {
    problems.push('a lane that reads repository or untrusted text needs an egress allowlist (security C12)');
  }
  const budget = card.budget ?? {};
  if (budget.cap_usd !== null && typeof budget.cap_usd !== 'number') problems.push('budget.cap_usd must be a number or null');
  if (budget.cap_tokens !== null && !Number.isInteger(budget.cap_tokens)) {
    problems.push('budget.cap_tokens must be an integer or null');
  }
  return problems;
}

// The provider route on each card must be one the binding allows. Routes are separated by semicolons.
export function checkRoutes(cards, allowedText) {
  if (!isText(allowedText) || startsWithNone(allowedText)) {
    return ['Allowed routes must list the provider routes that may be used'];
  }
  const allowed = allowedText.split(';').map((route) => route.trim()).filter(Boolean);
  return cards
    .filter((card) => card && typeof card === 'object' && !allowed.includes(card.provider_route))
    .map((card) => `${card.sender_identity ?? 'card'}: provider route ${card.provider_route} is not in Allowed routes`);
}

// Canonical files

export function checkCanonical(root) {
  const read = (path) => normalise(readFileSync(join(root, path), 'utf8'));
  const problems = [];
  const protocol = read('SUPERSYMMETRY.md');
  if (!protocol.includes(`Version ${PROTOCOL_VERSION}`)) {
    problems.push(`SUPERSYMMETRY.md must state Version ${PROTOCOL_VERSION}`);
  }
  for (const heading of PROTOCOL_HEADINGS) {
    if (!protocol.includes(`\n${heading}\n`)) problems.push(`SUPERSYMMETRY.md is missing "${heading}"`);
  }
  for (const word of [...STATUSES, ...VERDICTS]) {
    if (!protocol.includes(`\`${word}\``)) problems.push(`SUPERSYMMETRY.md does not define \`${word}\``);
  }
  if (!protocol.includes(LEDGER_COLUMNS.join(' | '))) {
    problems.push('SUPERSYMMETRY.md section 8 must list the 12 ledger columns in order');
  }
  for (const path of REQUIRED_DOCS) {
    if (!existsSync(join(root, path))) problems.push(`missing ${path}`);
  }
  if (!read('CHANGELOG.md').includes(`## ${PROTOCOL_VERSION}`)) {
    problems.push(`CHANGELOG.md has no entry for ${PROTOCOL_VERSION}`);
  }
  problems.push(...checkBinding(read('templates/BINDING.md'), { allowPlaceholders: true })
    .map((problem) => `templates/BINDING.md: ${problem}`));
  problems.push(...checkLedger(read('templates/ACCEPTANCE_LEDGER.md'))
    .map((problem) => `templates/ACCEPTANCE_LEDGER.md: ${problem}`));
  return problems;
}

// Command line

function report(problems, label) {
  if (problems.length === 0) {
    console.log(`ok: ${label}`);
    return 0;
  }
  for (const problem of problems) console.log(`problem: ${problem}`);
  return 1;
}

// Active lane cards give the sender-to-account map. Retired and paused cards are kept for the duplicate check
// but do not authenticate anything. Two senders on one GitHub account is always reported.
function loadCards(directory, { allowSharedAccounts = false } = {}) {
  const problems = [];
  const cards = [];
  const accounts = Object.create(null);
  const usedIds = new Map();
  for (const name of readdirSync(directory).filter((file) => file.endsWith('.json')).sort()) {
    let card;
    try {
      card = JSON.parse(normalise(readFileSync(join(directory, name), 'utf8')));
    } catch (error) {
      problems.push(`${name}: not valid JSON (${error.message})`);
      continue;
    }
    problems.push(...checkCard(card).map((problem) => `${name}: ${problem}`));
    cards.push(card);
    if (!card || typeof card !== 'object' || !Number.isInteger(card.github_user_id)) continue;
    const key = String(card.github_user_id);
    if (usedIds.has(key) && !allowSharedAccounts) {
      problems.push(`${name}: GitHub account ${key} is already on ${usedIds.get(key)}; one account per sender`);
    } else {
      usedIds.set(key, card.sender_identity);
    }
    if (isText(card.sender_identity) && card.status === 'active') {
      if (accounts[card.sender_identity] !== undefined) problems.push(`${name}: duplicate active sender ${card.sender_identity}`);
      accounts[card.sender_identity] = key;
    }
  }
  return { problems, cards, accounts };
}

function readText(path) {
  try {
    return { text: normalise(readFileSync(path, 'utf8')) };
  } catch (error) {
    console.log(`problem: cannot read ${path} (${error.code ?? error.message})`);
    return { unreadable: true };
  }
}

const COMMANDS = ['ledger', 'binding', 'message', 'channel', 'card', 'cards'];

function main(argv) {
  const positional = argv.filter((arg) => !arg.startsWith('--'));
  const flag = (name) => argv.find((arg) => arg.startsWith(`--${name}=`))?.slice(name.length + 3);
  const [command, file, extra] = positional;
  if (!command) {
    return report(checkCanonical(join(dirname(fileURLToPath(import.meta.url)), '..')), 'canonical files');
  }
  if (!COMMANDS.includes(command) || !file) {
    console.log('usage: node scripts/check.mjs [ledger <file> [--today=DATE] | binding|message|card <file> | channel <file> [cards-dir] [--owner=ID] | cards <dir> <binding-file>]');
    return 2;
  }
  if (command === 'cards') {
    if (!extra) {
      console.log('usage: node scripts/check.mjs cards <dir> <binding-file>');
      return 2;
    }
    const binding = readText(extra);
    if (binding.unreadable) return 2;
    try {
      const fields = bindingFields(binding.text);
      const shared = /^declared shared\b/i.test(fields.get('Lane identity') ?? '');
      const { problems, cards } = loadCards(file, { allowSharedAccounts: shared });
      return report([...problems, ...checkRoutes(cards, fields.get('Allowed routes'))], file);
    } catch (error) {
      console.log(`problem: cannot read cards in ${file} (${error.code ?? error.message})`);
      return 2;
    }
  }
  const source = readText(file);
  if (source.unreadable) return 2;
  const { text } = source;
  if (command === 'ledger') return report(checkLedger(text, { today: flag('today') }), file);
  if (command === 'binding') return report(checkBinding(text), file);
  if (command === 'message') return report(checkMessage(text), file);
  if (command === 'card') {
    let card;
    try {
      card = JSON.parse(text);
    } catch (error) {
      return report([`${file} is not valid JSON (${error.message})`], file);
    }
    return report(checkCard(card), file);
  }
  let items;
  try {
    items = JSON.parse(text);
    if (!Array.isArray(items)) throw new Error('expected an array');
  } catch (error) {
    return report([`${file} is not a JSON array of messages (${error.message})`], file);
  }
  if (!extra) return report(checkChannel(items), file);
  let loaded;
  try {
    loaded = loadCards(extra);
  } catch (error) {
    console.log(`problem: cannot read cards in ${extra} (${error.code ?? error.message})`);
    return 2;
  }
  return report([...loaded.problems, ...checkChannel(items, { cards: loaded.accounts, owner: flag('owner') })], file);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = main(process.argv.slice(2));
}
