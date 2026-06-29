# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Purpose

This is a living study guide for the **Anthropic Claude Certification exam**, focused on Domain 1: Agentic Architecture & Orchestration. Each file in `docs/learn/` is a lesson covering one task statement from the exam blueprint. The `docs/practice/` directory holds an exam-style question bank with a matching answer key.

## Structure

```
agenthic_architecture&orchestration/
  CLAUDE.md
  docs/
    learn/          # Lesson files, one per task statement (1.1–1.7 currently)
    practice/       # Exam-style question bank
      questions.md  # Numbered multiple-choice questions (A–D)
      answer-key.md # Keyed answers with per-question reasoning + lesson references
```

Lesson files are numbered `<domain>.<task> <slug>.md` (e.g. `1.3 subagent-invocation-and-context-passing.md`). New lessons follow the same naming pattern.

`answer-key.md` mirrors `questions.md`: every answer cites the `docs/learn/` task statement it tests and explains why the keyed option is correct and why each distractor fails. Keep the two files in sync when adding or editing questions.

## Markdown Conventions

All lesson files share a consistent internal structure. Maintain these conventions when editing or adding files.

### Section order

1. `# <number> — <Title> | Claude Certification Guide` (H1 — page title)
2. `# <Title>` (H1 — display heading)
3. `## What You Need to Know` — core concept explanations
4. `## Exam Traps` — formatted blockquotes (see below)
5. `## Practice Scenario` — multiple-choice question with A–D options (see below)
6. `## Sources` — bulleted list of source links

### Exam Trap format

```markdown
> **Exam Trap — <short title describing the wrong answer pattern>**
>
> <Explanation of why it is wrong and what the correct approach is.>
```

### Practice Scenario option format

```markdown
**Option A** — <full option text>

**Option B** — <full option text>
```

### Decision tables / matrices

Use standard markdown pipe tables with a header row and `|---|---|---|` separator. See `1.5 agent-sdk-hooks.md` (Decision Framework) and `1.7 session-state-and-resumption.md` (Decision Matrix) for reference.

### Inline code

Tool names, API fields, CLI flags, and SDK identifiers always use backticks: `stop_reason`, `tool_use`, `fork_session`, `--resume`, `process_refund`, `PreToolUse`, `PostToolUse`.

### Key Concept callouts

Currently plain paragraphs labelled "Key Concept" — keep this style consistent; do not convert to blockquotes (they are intentionally distinct from Exam Traps).

## Content Scope (Domain 1 — task statements covered)

| File | Task Statement | Core concept |
|---|---|---|
| 1.1 | Agentic Loops | `stop_reason` as the only reliable loop-control signal |
| 1.2 | Multi-Agent Orchestration | Hub-and-spoke; all communication through coordinator |
| 1.3 | Subagent Invocation & Context Passing | Agent tool, explicit context passing, structured metadata |
| 1.4 | Workflow Enforcement & Handoff | Programmatic enforcement vs. prompt-based guidance |
| 1.5 | Agent SDK Hooks | PreToolUse (block before) vs. PostToolUse (normalise after) |
| 1.6 | Task Decomposition Strategies | Fixed pipeline vs. dynamic adaptive; attention dilution |
| 1.7 | Session State & Resumption | `--resume` vs. `fork_session` vs. fresh start + summary |

## Recurring exam-question patterns

Each lesson's **Exam Traps** section and **Practice Scenario** are the most exam-critical parts. When reviewing or extending content, ensure:

- Exam Traps cover the specific **wrong-answer distractors** the exam uses, not just general misconceptions.
- The Practice Scenario has exactly **four options (A–D)** with one unambiguously correct answer derivable from the lesson content.
- The correct answer is never Option A (avoids anchoring bias in study). This convention applies **only** to the lesson Practice Scenarios in `docs/learn/`; the `docs/practice/questions.md` bank is not bound by it and several of its correct answers are Option A.
