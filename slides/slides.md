---
theme: seriph
fonts:
  # Inter everywhere — a crisp, neutral UI typeface (the de-facto "tech"
  # sans), overriding seriph's Times-like serif. Fira Code for code.
  # Slidev auto-fetches these from Google Fonts.
  # (To revert the look to the previous softer feel, set these to Nunito.)
  sans: Inter
  serif: Inter
  mono: Fira Code
title: Agentic Architecture & Orchestration — Domain 1
# Hash routing avoids a base-doubling bug in Slidev 52 + vue-router 5 when the
# deck is served from a GitHub Pages subpath: in history mode, client-side
# navigation appends the --base a second time (…/<base>/<base>/2). With hash
# routing the slide lives after the '#', so the base is applied only once.
routerMode: hash
info: |
  ## Claude Certification — Domain 1
  Agentic Architecture & Orchestration.
  A study deck generated from the docs/learn lessons and docs/practice question bank.
class: text-center
highlighter: shiki
lineNumbers: false
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Agentic Architecture & Orchestration

Claude Certification · **Domain 1** study deck

<div class="pt-6 opacity-70 text-sm">
7 task statements (1.1 – 1.7) &nbsp;·&nbsp; + interactive practice quiz
</div>

<div class="abs-br m-6 text-sm opacity-50">
Press <kbd>Space</kbd> / <kbd>→</kbd> to advance
</div>

---
layout: default
---

# Agenda

| # | Task statement | Core idea |
|---|---|---|
| **1.1** | Agentic Loops | `stop_reason` is the only reliable loop signal |
| **1.2** | Multi-Agent Orchestration | Hub-and-spoke; all comms through the coordinator |
| **1.3** | Subagent Invocation & Context Passing | Agent tool + explicit, structured context |
| **1.4** | Workflow Enforcement & Handoff | Programmatic enforcement vs. prompts |
| **1.5** | Agent SDK Hooks | `PreToolUse` (block) vs. `PostToolUse` (normalise) |
| **1.6** | Task Decomposition | Fixed pipeline vs. dynamic; attention dilution |
| **1.7** | Session State & Resumption | `--resume` vs. `fork_session` vs. fresh + summary |
| 🧪 | Practice quiz | 10 exam-style questions |

<div class="pt-3 opacity-60 text-xs">Tip: each lesson ends with a "test yourself" slide — click to reveal the answer.</div>

---
src: ./pages/01-agentic-loops.md
---

---
src: ./pages/02-multi-agent-orchestration.md
---

---
src: ./pages/03-subagent-invocation.md
---

---
src: ./pages/04-workflow-enforcement.md
---

---
src: ./pages/05-agent-sdk-hooks.md
---

---
src: ./pages/06-task-decomposition.md
---

---
src: ./pages/07-session-state.md
---

---
src: ./pages/08-practice-quiz.md
---

---
layout: center
class: text-center
---

# That's Domain 1

`stop_reason` for loops · hub-and-spoke for orchestration · explicit structured context
· hooks for 100% rules · right pattern for the task · right session mode for the state

<div class="pt-6 opacity-60 text-sm">
Source: <code>docs/learn/</code> lessons 1.1–1.7 and <code>docs/practice/</code> question bank
</div>
