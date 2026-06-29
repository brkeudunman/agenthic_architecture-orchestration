---
layout: section
---

# 1.2 — Multi-Agent Orchestration

Hub-and-spoke: a coordinator at the centre

---
layout: default
---

## Hub-and-spoke architecture

Two roles, one cardinal rule.

- **Coordinator** (the hub) — receives the task, decomposes it, decides which subagents to invoke, passes context, aggregates results, handles errors, routes information.
- **Subagents** (the spokes) — each handles one specialised task (search, analysis, synthesis, report) and returns results to the coordinator.

> **ALL communication flows through the coordinator.** Subagents never talk to each other directly — not for efficiency, not for convenience, ever.

Centralisation buys: **observability** · **consistent error handling** · **controlled information flow**.

---

## The critical isolation principle

The single most misunderstood concept — and the exam exploits it.

**Subagents do NOT inherit the coordinator's conversation history.** A spawned subagent starts with *only* what the coordinator puts in its prompt. No access to:

- the coordinator's system prompt or prior messages
- other subagents' results
- any "shared memory" or global state

**Subagents do NOT share memory between invocations** — every call is independent.

<KeyConcept>
Every piece of information a subagent needs must be explicitly included in its prompt. If the synthesis agent needs search results, the coordinator must pass them — the subagent cannot "look them up."
</KeyConcept>

---

## Coordinator responsibilities

<v-clicks>

1. **Dynamic subagent selection** — route by need, not always through the full pipeline. A simple question may need only search.
2. **Research-scope partitioning** — assign distinct subtopics/sources to minimise duplication.
3. **Iterative refinement loops** — evaluate synthesis for gaps, re-delegate with targeted queries until coverage is sufficient.
4. **Centralised routing** — all comms through the coordinator for observability and uniform error handling.

</v-clicks>

---

## The narrow-decomposition failure

A coordinator decomposes *"renewable energy technologies"* into only **solar** and **wind**. Each subagent does thorough, well-sourced work. The report says nothing about geothermal, tidal, biomass, or fusion.

**Root cause = the coordinator's decomposition.** Not the search agent (it searched what it was assigned), not synthesis (it combined what it received).

- ❌ Better search queries
- ❌ A more capable synthesis agent
- ❌ More subagents (they'd get equally narrow assignments)
- ✅ Better coordinator decomposition covering the full breadth

> Trace failures to their **origin**. Incomplete *scope* (not depth) → almost always decomposition.

---

## Exam Traps

<v-clicks>

<ExamTrap title="Blaming downstream agents for coverage gaps">
Subagents research what they're assigned. Narrow assignments → narrow coverage. Trace it to the coordinator's decomposition.
</ExamTrap>

<ExamTrap title="Assuming subagents share memory / inherit history">
Context is fully isolated. Nothing is inherited automatically; everything must be passed explicitly in the prompt.
</ExamTrap>

<ExamTrap title="Direct inter-subagent communication for 'efficiency'">
Breaks observability, error handling, and controlled flow. All comms route through the coordinator.
</ExamTrap>

<ExamTrap title="Adding more subagents to fix decomposition">
More agents get equally narrow assignments. Fix the coordinator's decomposition logic instead.
</ExamTrap>

</v-clicks>

---
layout: default
---

## Test yourself

A report on "renewable energy technologies" covers only solar and wind. Every subagent did thorough, well-sourced work on its assigned topic; synthesis combined everything it was given. Most likely root cause?

- **A** — Web search used queries too narrow, missing other energy types
- **B** — Synthesis failed to spot gaps and request more coverage
- **C** — The coordinator decomposed into only solar & wind, never assigning the rest
- **D** — Document analysis lacked access to other sources

<v-click>

> ✅ **Answer: C.** Coverage gaps in *scope* trace to coordinator decomposition. The downstream agents performed correctly on what they received.

</v-click>
