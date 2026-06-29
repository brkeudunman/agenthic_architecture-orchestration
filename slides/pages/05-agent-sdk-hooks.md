---
layout: section
---

# 1.5 — Agent SDK Hooks

Deterministic behaviour at the tool boundary

---
layout: default
---

## Two types of hooks

Hooks sit between the model's decisions and the real world.

- **`PreToolUse`** runs **before** a tool executes. It can **block, modify, or redirect** the outgoing call. The tool never runs if the hook blocks it. → *policy enforcement*
- **`PostToolUse`** runs **after** a tool executes but **before** the model sees the result. It **transforms/normalises** the result. → *data normalisation*

<KeyConcept>
<code>PostToolUse</code> transforms data <strong>after</strong> execution. <code>PreToolUse</code> enforces policy <strong>before</strong> execution. Know which direction each operates in — the exam tests this.
</KeyConcept>

---

## PostToolUse — data normalisation

Different tools return data in different shapes. Without normalisation the model must re-interpret formats on every turn — inconsistently.

| Raw from tools | Normalised before the model sees it |
|---|---|
| Unix `1710489600` · ISO `2024-03-15T…` · `DD/MM/YYYY` | All → ISO 8601 |
| `200/404` · `"active"` · `"S"/"P"` | All → human-readable strings |
| Mixed currency formats | Consistent decimal + currency code |

The model receives clean, consistent data every time — regardless of which backend produced it.

---

## PreToolUse — policy enforcement

The implementation mechanism for 1.4's prerequisite gates. Intercept the outgoing call and apply business rules:

- **Refund threshold** — intercept `process_refund`; if amount > $500, block and route to human escalation. The tool never runs.
- **Compliance gate** — intercept `transfer_funds`; if the AML check hasn't passed this session, block and tell the agent to run it first.
- **Manager approval** — intercept `approve_discount` above 20%; pause and route to an approval queue.

<ExamTrap title="PostToolUse to block policy-violating actions">
<code>PostToolUse</code> runs <em>after</em> execution — by then the non-compliant action already happened. Use <code>PreToolUse</code> to block before.
</ExamTrap>

---

## The decision framework

| Requirement | Mechanism | Guarantee |
|---|---|---|
| Must hold **100% of the time** | **Hooks** | Deterministic |
| Preferred, occasional deviation OK | **Prompts** | Probabilistic |

- A single failure loses **money** → hook
- A single failure creates **legal risk** → hook
- It's a **formatting / style** preference → prompt is fine

> The question isn't "are prompts good enough?" — it's "does the cost of *one* failure justify a deterministic guarantee?"

---

## Exam Traps

<v-clicks>

<ExamTrap title="PostToolUse to block policy violations">
Runs after execution — too late. Use <code>PreToolUse</code> (pre-execution) to block.
</ExamTrap>

<ExamTrap title="Enhanced prompts for 100% compliance">
Prompts are probabilistic. 100% enforcement (financial, regulatory, security) requires hooks.
</ExamTrap>

<ExamTrap title="Model-side data transformation instead of PostToolUse">
Relying on the model to normalise heterogeneous formats is inconsistent. A <code>PostToolUse</code> hook guarantees clean data.
</ExamTrap>

<ExamTrap title="Confusing hook direction">
<code>PostToolUse</code> = after (normalise results). <code>PreToolUse</code> = before (block/modify calls). Wrong direction = miss the block or block completed work.
</ExamTrap>

</v-clicks>

---
layout: default
---

## Test yourself

An agent occasionally processes international transfers without the required AML check. Compliance demands 100% enforcement; the current prompt works ~95% of the time. Correct approach?

- **A** — Detailed AML instructions + examples + penalty warnings in the prompt
- **B** — A `PreToolUse` hook blocking `transfer_funds` until `aml_check` returns a verified pass
- **C** — A `PostToolUse` hook flagging completed transfers that skipped AML for review
- **D** — Few-shot examples of the correct AML workflow before every transfer

<v-click>

> ✅ **Answer: B.** 100% compliance on a financial/regulatory operation → `PreToolUse` (pre-execution block). A and D stay probabilistic; C fires too late — the transfer already happened.

</v-click>
