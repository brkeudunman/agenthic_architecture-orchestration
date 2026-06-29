---
layout: section
---

# 1.6 — Task Decomposition Strategies

Pick the pattern that matches the task

---
layout: default
---

## Two patterns

**Fixed sequential pipeline (prompt chaining)** — predetermined steps; each step's output feeds the next. The sequence never changes based on findings.

- ✅ Consistent, reliable, easy to debug & monitor
- ❌ Cannot adapt to unexpected discoveries

**Dynamic adaptive decomposition** — the plan evolves as the agent learns. Start with a goal, investigate, generate and revise subtasks.

- ✅ Adapts to the problem; thorough on open-ended work
- ❌ Less predictable; variable runtime; harder to debug

<KeyConcept>
Fixed pipelines suit predictable, structured tasks. Dynamic decomposition suits open-ended tasks with unknown scope. Match the pattern to the task — not to what sounds more sophisticated.
</KeyConcept>

---

## Selecting the right pattern

| Task characteristics | Pattern |
|---|---|
| Steps known in advance, structured input | Fixed pipeline |
| Open-ended, unknown scope | Dynamic decomposition |
| Multi-file code review | Fixed pipeline |
| Legacy codebase exploration | Dynamic decomposition |
| Document extraction (known fields) | Fixed pipeline |
| Debugging an unfamiliar system | Dynamic decomposition |

<ExamTrap title="Matching pattern to sophistication, not task">
Don't apply a fixed pipeline to open-ended investigation, or dynamic decomposition to structured processing. Match the task characteristics.
</ExamTrap>

---

## The attention-dilution problem

Processing too many items in a single pass → **inconsistent depth**.

**Telltale symptoms**

- Detailed feedback for the first few files; increasingly shallow for later ones
- A pattern flagged in one file, identical code approved in another
- Obvious bugs missed late while minor style nits caught early

**Why** — the model spreads its attention budget across all items; later items get skimmed.

> It is an **architectural** problem — *not* a model-capability or context-window problem.

---

## The fix: multi-pass architecture

Split the work into two layers:

1. **Per-item local passes** — analyse each file/document/module individually, each with the *full* attention budget.
2. **Cross-item integration pass** — after all local passes, one pass for cross-cutting concerns (data flow, inconsistent patterns, cross-file dependencies).

**The 14-file review:** files 1–5 detailed, 10–14 superficial (missed null-pointer & SQLi bugs); `forEach` flagged in file 3, ignored in file 11.

→ 14 per-file passes catch the local bugs; the integration pass catches the inconsistent `forEach`. *Not* a bigger model or longer prompt.

---

## Exam Traps

<v-clicks>

<ExamTrap title="Bigger model / larger context for attention dilution">
It's architectural. Too many items per pass → inconsistent depth regardless of model power or context size. Use multi-pass.
</ExamTrap>

<ExamTrap title="'Better prompts' single-pass = multi-pass">
Prompts lift average quality but don't solve attention allocation. Only multi-pass guarantees dedicated attention per item.
</ExamTrap>

<ExamTrap title="Fixed pipelines for open-ended investigation">
Open-ended tasks need adaptability. Use dynamic adaptive decomposition when scope is unknown.
</ExamTrap>

<ExamTrap title="Batching without a cross-file integration pass">
Batching cuts in-batch dilution but misses cross-batch issues. Add a dedicated integration pass.
</ExamTrap>

</v-clicks>

---
layout: default
---

## Test yourself

A review agent processes 14 files: detailed for the first 5, misses obvious bugs in 10–14, and flags a `forEach` as inefficient in one file while approving identical code in another. Root cause and fix?

- **A** — Context window too small → upgrade to a larger-context model
- **B** — Split into per-file local passes + a cross-file integration pass (attention dilution)
- **C** — Stronger prompt emphasising equal thoroughness across all files
- **D** — Reduce to 5 files per review, processed in sequential batches of 5

<v-click>

> ✅ **Answer: B.** The symptoms are textbook attention dilution — an architectural problem. A and C don't address attention allocation; D (batching) misses cross-batch issues without an integration pass.

</v-click>
