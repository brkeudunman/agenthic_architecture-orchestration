---
layout: section
---

# 1.7 — Session State & Resumption

Continue, branch, or start fresh

---
layout: default
---

## Three session-management options

- **`--resume <session-name>`** — continue a specific named session; the *entire* history (tool results, analyses, reasoning) is restored.
  *Use when prior context is still valid and files haven't changed.*

- **`fork_session`** — create an **independent branch** from a shared baseline; branches don't see each other.
  *Use to explore divergent approaches from the same starting analysis.*

- **Fresh start + summary injection** — a new session seeded with a curated summary; **no stale tool results**.
  *Use when prior tool results are stale or the context has degraded.*

<KeyConcept>
<strong>Resume</strong> for continuation · <strong>fork</strong> for divergent exploration · <strong>fresh start + summary</strong> when prior tool results are stale. Selecting the right one for the scenario is exactly what the exam tests.
</KeyConcept>

---

## The stale-context problem

The central concept. Resuming after code changes makes the agent reason from **cached tool results** that no longer match the files.

**How it manifests** — you fix 3 files and resume; Claude recommends changes already made, or references code that no longer exists.

**Why** — resume restores the *whole* history, including old file reads. The model reasons from stale data alongside new data → contradictions.

**Naive fix (insufficient)** — resume and ask it to re-read the files. The stale results *remain* in history and can still influence reasoning.

**Correct fix** — **fresh session + structured summary**, naming which files changed for targeted re-analysis.

---

## Targeted re-analysis vs full re-exploration

When a few files change, don't re-analyse the whole codebase.

1. Start a fresh session.
2. Inject a summary: *"Prior analysis found X, Y, Z. These 3 files changed since: `auth.ts`, `database.ts`, `api-routes.ts`."*
3. The agent re-reads **only** the 3 modified files.
4. It combines the fresh analysis with the preserved summary of everything unchanged.

> Faster than full re-exploration, more reliable than resuming with stale context.

---

## Decision matrix

| Scenario | Best option |
|---|---|
| Continuing yesterday's work, no files changed | `--resume` |
| Comparing two refactoring approaches | `fork_session` |
| Resuming after modifying 3 of 50 files | Fresh start + summary |
| Long session with cluttered history | Fresh start + summary |
| Testing strategy vs documentation strategy | `fork_session` |
| Resuming after dependency updates | Fresh start + summary |

---

## Exam Traps

<v-clicks>

<ExamTrap title="Full re-exploration when only 3 of 50 files changed">
Wasteful. Name the 3 changed files for targeted re-analysis; the summary covers the rest.
</ExamTrap>

<ExamTrap title="--resume after files were modified">
Resume preserves stale tool results; the agent may reason from outdated contents. Use fresh start + summary.
</ExamTrap>

<ExamTrap title="Confusing fork_session with --resume">
Fork = independent branches for different approaches. Resume = continue the same conversation.
</ExamTrap>

<ExamTrap title="fork_session to handle stale context">
A fork branches from the existing session — it <em>inherits</em> the stale results. Fresh start + summary is correct.
</ExamTrap>

</v-clicks>

---
layout: default
---

## Test yourself

A developer resumes a Claude Code session after modifying 3 files in a 50-file codebase. The agent gives contradictory advice — recommending changes already made and referencing code that no longer exists. Best approach?

- **A** — New session; re-analyse all 50 files from scratch
- **B** — Resume and ask it to re-read only the 3 modified files
- **C** — Fresh session + injected summary of prior findings, naming the 3 changes for targeted re-analysis
- **D** — Use `fork_session` to branch and incorporate the changes independently

<v-click>

> ✅ **Answer: C.** Classic stale context. A is wasteful; B leaves stale results in history; D inherits the stale context. Fresh start + summary + targeted re-analysis is reliable and efficient.

</v-click>
