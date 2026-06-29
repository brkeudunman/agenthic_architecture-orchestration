---
layout: section
---

# 1.1 — Agentic Loops

The core execution cycle of every Claude agent

---
layout: default
---

## The Agentic Loop Lifecycle

A deterministic control-flow pattern — not a prompt trick, not a retry loop. Four steps, repeated until completion:

1. **Send a request** to Claude (history + prior tool results)
2. **Inspect `stop_reason`** — the authoritative signal for what happens next
3. **If `tool_use`** → execute tools, **append results to history**, send back
4. **If `end_turn`** → done; present the final response

The make-or-break detail is step 3: tool results **must** be appended to history, or the model can't reason about them on the next turn.

---

## `stop_reason` is the signal

```python
while True:
    resp = client.messages.create(model="claude-opus-4-8", messages=history, tools=tools)
    if resp.stop_reason == "tool_use":
        history.append(resp)                 # keep assistant turn
        history.append(run_tools(resp))      # append tool_result
        continue
    if resp.stop_reason == "end_turn":
        break                                # finished
```

<KeyConcept>
The <code>stop_reason</code> field is the <strong>only</strong> reliable signal for loop control — deterministic and unambiguous. Never use natural-language parsing, text-content checks, or iteration caps as your primary stopping mechanism.
</KeyConcept>

---

## The three anti-patterns

<v-clicks>

- **Parse natural language** ("I'm done", "task complete") — ambiguous; the model may say "finished the first file" while intending to continue.
- **Iteration caps as the primary stop** ("stop after 10") — cuts off useful work *or* runs needless turns. Fine as a *safety net*, never as the control.
- **Check for text content** (`content[0].type == "text"`) — Claude returns text *alongside* `tool_use`; text presence ≠ completion.

</v-clicks>

<div v-click class="pt-3 opacity-80 text-sm">
Model-driven decision-making wins for flexibility — <em>except</em> when business logic needs deterministic compliance (see 1.4).
</div>

---

## Exam Traps

<v-clicks>

<ExamTrap title="content[0].type == 'text' for completion">
Claude returns text alongside <code>tool_use</code> in the same response. Text presence does not indicate completion — <code>stop_reason</code> is authoritative.
</ExamTrap>

<ExamTrap title="Iteration caps as the primary stop">
Caps either cut off useful work or waste turns. Acceptable as a safety net only. Use <code>stop_reason</code>.
</ExamTrap>

<ExamTrap title="Forcing tool_choice = 'any'">
Forces tool use even when genuinely finished → infinite loop. Let the model signal completion via <code>stop_reason</code>.
</ExamTrap>

</v-clicks>

---
layout: default
---

## Test yourself

An agent sometimes terminates early when Claude returns text alongside a tool call. The loop checks `content[0].type == 'text'`. Users report incomplete responses. What should change?

- **A** — Add an iteration cap of 15 loops
- **B** — Check `stop_reason`: continue on `tool_use`, terminate on `end_turn`
- **C** — Parse assistant text for "I have finished" before terminating
- **D** — Set `tool_choice` to `any` so Claude always calls a tool

<v-click>

> ✅ **Answer: B.** The content-type check is the bug. `stop_reason` is the only reliable signal — caps (A), text parsing (C), and forced tool use (D) don't fix premature exit.

</v-click>
