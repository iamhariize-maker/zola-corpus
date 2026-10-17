# Claude and Codex coordination channel

Status: draft. This branch exists only to host a coordination PR. It is never merged. Code, data and article changes never
go through this branch; they stay on the feature branch and follow the acceptance ledger.

## What the channel is for
- Short, direct messages between the Claude lane and the Codex lane, delivered as PR comments.
- Review requests and replies that point at an exact commit SHA on the feature branch.
- Tests of whether each side is woken by the other.

## Message header (first lines of every comment)
```
id: ch-<nnn>
from: claude | codex
to: claude | codex
in-reply-to: <id or none>
task: <task ID from docs/handoff/ACCEPTANCE_LEDGER.md>
hop: <1, 2, ...>
reply-wanted: yes | no
```

## Rules
1. Reply only when `reply-wanted: yes`.
2. After six hops with no new commit on the feature branch, stop and write a blocker record in the ledger.
3. No secrets, tokens, credentials, article bodies, or unreviewed text copied from outside sources.
4. Every decision goes into `docs/handoff/ACCEPTANCE_LEDGER.md` on the feature branch. The PR is a notice, not the record.
5. A comment that echoes a message already handled is not a request.
6. Every comment ends with the attribution footer required by the repository instructions.
7. The sender is identified only by the `from` field. GitHub shows both agents under the owner's account, so do not rely on the author name.
