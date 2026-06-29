---
layout: section
---

# 1.4 — Workflow Enforcement & Handoff

Prompt guidance vs. programmatic enforcement

---
layout: default
---

## The enforcement spectrum

| | Prompt-based guidance | Programmatic enforcement |
|---|---|---|
| **What** | Instructions in the system prompt | Hooks, prerequisite gates, code checks |
| **Reliability** | Probabilistic (~90–95%) | Deterministic (every time) |
| **Failure rate** | Non-zero | Zero |
| **Use for** | Formatting, style, low-stakes ordering | Money, security, compliance |

<KeyConcept>
The exam decision rule: <strong>if a single failure would cause financial loss, a security breach, or a compliance violation → use programmatic enforcement.</strong> Otherwise prompts are fine.
</KeyConcept>

---

## The decision rule in practice

- **Financial** (refunds, transfers, payments) → enforcement. One wrong refund = real loss.
- **Security** (identity, access control) → enforcement. One bypass = breach.
- **Compliance** (AML, regulatory) → enforcement. One miss = legal penalty.
- **Low-stakes** (formatting, style, ordering) → prompts are acceptable.

> The exam offers "stronger prompt" and "few-shot examples" as distractors for high-stakes scenarios. **Reject them** — they improve probability but never reach 0% failure.

---

## Prerequisite gates

A code-level check that blocks a tool until a prior condition is met:

```text
process_refund called
   └─ gate: has get_customer returned a verified customer ID this session?
        ├─ yes → execute refund
        └─ no  → block + return:
                 "Cannot process refund — identity not verified. Call get_customer first."
```

The gate is **code, not a prompt**. The model cannot bypass it by deciding to skip verification — even a direct `process_refund` call is blocked and redirected.

---

## Subagent lifecycle hooks

Complement the `PreToolUse` / `PostToolUse` hooks of 1.5:

- **`SubagentStart`** — fires when a subagent is spawned. Log, validate, or modify the invocation (rate-limit spawning, verify required context was passed).
- **`SubagentStop`** — fires when a subagent returns. Intercept/validate/transform output before the coordinator processes it (schema checks, strip sensitive data).
- **Subagent-scoped hooks** — a subagent can define its own `PreToolUse`/`PostToolUse` in its frontmatter, scoped only to itself.
- **Stop-hook auto-conversion** — Stop hooks in a subagent's frontmatter auto-convert to `SubagentStop` events at runtime.

---

## Structured handoff to a human

Critical constraint: **the human agent does NOT have the conversation transcript.** The handoff summary must be self-contained:

- **Customer ID** — to pull up the account
- **Conversation summary** — what was asked and attempted
- **Root cause analysis** — the agent's assessment
- **Refund amount** (if applicable) — the specific figure
- **Recommended action** — what the human should do

Omit a field → the human must make the customer repeat everything.

*(Multi-concern requests: decompose → investigate in parallel on shared context → synthesise one unified resolution.)*

---

## Exam Traps

<v-clicks>

<ExamTrap title="Stronger prompt for high-stakes compliance failures">
A prompt failing 8% of the time might drop to 3–4% — never 0%. Money/security/compliance need programmatic enforcement.
</ExamTrap>

<ExamTrap title="Few-shot examples as 'guaranteed' compliance">
Few-shot improves behaviour but stays probabilistic. Use prerequisite gates.
</ExamTrap>

<ExamTrap title="Routing classifiers for per-agent compliance">
Classifiers handle routing, not in-sequence workflow enforcement. The failure is inside execution, not at routing.
</ExamTrap>

<ExamTrap title="Handoff summaries missing customer ID / recommended action">
The human has no transcript. The summary must be complete and self-contained.
</ExamTrap>

</v-clicks>

---
layout: default
---

## Test yourself

In 8% of cases a support agent processes refunds without verifying account ownership — sometimes refunding wrong accounts. The prompt already says "always verify identity before refunds." Best fix?

- **A** — A programmatic prerequisite gate blocking `process_refund` until `get_customer` returns a verified ID
- **B** — Stronger prompt instructions emphasising verification
- **C** — Few-shot examples of the verify-then-refund sequence
- **D** — A routing classifier sending refunds to a verification-first pipeline

<v-click>

> ✅ **Answer: A.** A financial operation with a non-zero failure rate demands deterministic enforcement. B and C stay probabilistic; D fixes routing, not in-sequence enforcement.

</v-click>
