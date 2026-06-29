---
layout: section
---

# 1.3 — Subagent Invocation & Context Passing

The wiring beneath the architecture

---
layout: default
---

## The Agent tool

The **Agent tool** (renamed from **Task** in Agent SDK v2.1.63; `Task` still works as an alias) spawns subagents from a coordinator.

<KeyConcept>
The coordinator's <code>allowedTools</code> must include <code>"Agent"</code> (or <code>"Task"</code>). This is a <strong>binary gate</strong> — without it, the coordinator cannot invoke any subagent, no matter how they're defined.
</KeyConcept>

Each subagent is an **AgentDefinition** specifying:

1. **Description** — what it does (the coordinator uses this to decide when to invoke)
2. **System prompt** — the instructions it follows
3. **Tool restrictions** — tools scoped to its role

---

## Context passing: three rules

Subagents receive only what the coordinator puts in their prompt.

<v-clicks>

1. **Include complete findings from prior agents** — pass them *in full*. The downstream agent can't "look them up."
2. **Use structured data separating content from metadata** — claim *and* source URL / doc name / page number. No metadata → no citations.
3. **Specify goals, not procedures** — goal-oriented prompts let subagents adapt; step-by-step instructions make them brittle.

</v-clicks>

---

## Structured metadata format

Separate the content (claim) from its attribution (metadata):

```json
{
  "findings": [
    {
      "claim": "Solar panel efficiency rose 25% in the last decade",
      "source_url": "https://example.com/solar-report",
      "document_name": "Annual Solar Industry Report 2024",
      "page_number": 14,
      "confidence": "high",
      "retrieved_by": "web_search_agent"
    }
  ]
}
```

With this, the synthesis agent has everything it needs to produce a properly cited report.

---

## Parallel spawning · fork_session

**Parallel spawning** — for independent subtasks, emit **multiple Agent calls in a single response** rather than one per turn. Sequential spawning adds needless latency. Look for "in a single response" / "simultaneously" in answer options.

**`fork_session`** — creates **independent branches from a shared baseline**. After an initial analysis, fork to explore divergent approaches; branches don't see each other.

> `fork_session` ≠ `--resume`. **Fork** = divergent exploration from a shared start. **Resume** = continue one specific named session.

---

## Exam Traps

<v-clicks>

<ExamTrap title="Assuming auto-access to history / other agents' outputs">
Context is isolated. Everything a subagent needs must be in its prompt — no automatic inheritance.
</ExamTrap>

<ExamTrap title="Blaming the synthesis agent for missing citations">
It can only cite sources it was given. Missing citations = the coordinator passed content without structured metadata.
</ExamTrap>

<ExamTrap title="Sequential invocation for independent tasks">
Adds latency. Spawn independent subagents in parallel — multiple Agent calls in one response.
</ExamTrap>

<ExamTrap title="Confusing fork_session with --resume">
Fork = independent branches for comparing approaches. Resume = continue a specific session.
</ExamTrap>

</v-clicks>

---
layout: default
---

## Test yourself

A synthesis report has several claims with no source attribution. The search agent returns URLs/titles/snippets correctly; document analysis returns page references correctly. Both verified working. Root cause?

- **A** — The synthesis prompt lacks instructions to cite sources
- **B** — The coordinator passes content *without* structured metadata (URLs, doc names, pages)
- **C** — The search agent must return a format synthesis can parse
- **D** — Synthesis should get direct web-search tool access to verify sources

<v-click>

> ✅ **Answer: B.** The agent can't cite sources it never received. Fix the coordinator's context passing (Rule 2), not the synthesis prompt (A) or its tools (D).

</v-click>
