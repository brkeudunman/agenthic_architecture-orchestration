# Answer Key — Domain 1 Practice Questions

Answers and reasoning for [`questions.md`](questions.md). Each entry cites the lesson in [`../learn/`](../learn/) that the question tests, explains why the keyed option is correct, and why each distractor fails.

## Answer Summary

| Q | Answer | Task Statement | Core principle tested |
|---|---|---|---|
| 1 | **A** | 1.4 / 1.5 | Programmatic enforcement (PreToolUse hook) for compliance, not prompts |
| 2 | **A** | 1.3 | Specify goals, not procedures, to enable subagent adaptability |
| 3 | **B** | 1.3 | Structured claim-source mappings preserved through synthesis |
| 4 | **A** | 1.7 / 1.2 | Structured report persistence + coordinator-injected state |
| 5 | **D** | 1.3 / 1.2 | Coordinator-spawned parallel subagents preserve observability |
| 6 | **A** | 1.2 / 1.3 | Subagent context isolation — coordinator must pass inputs |
| 7 | **B** | 1.3 / 1.2 | Preserve source characterizations; structure certain vs. contested |
| 8 | **C** | 1.3 | `allowedTools` must include `Agent`/`Task` to spawn subagents |
| 9 | **A** | 1.3 | Structured data separating content from source metadata |
| 10 | **B** | 1.2 | Hub-and-spoke — all communication flows through the coordinator |

---

## Question 1 — Answer: A

**Tests:** 1.4 Workflow Enforcement, 1.5 Agent SDK Hooks.

A compliance rule with a non-zero failure rate (3%) on a financial operation is the canonical "use programmatic enforcement" scenario. The exam decision rule from 1.4: *if a single failure would cause financial loss, security breach, or compliance violation, use programmatic enforcement.* 1.5 names this exact use case — "A hook intercepts all calls to `process_refund`. If the refund amount exceeds $500, the hook blocks the call and redirects to a human escalation workflow."

- **A ✓** — A PreToolUse hook intercepts the call, blocks it deterministically when the amount exceeds $500, and invokes human escalation. Works 100% of the time and satisfies the "automatically escalate to a human agent" requirement.
- **B ✗** — Having the tool return an error is closer to enforcement than a prompt, but it only refuses the action; it does not escalate to a human, and it leaves the policy logic inside the tool's return path rather than at a guaranteed pre-execution gate. It is a weaker, incomplete version of A.
- **C ✗** — "Emphatic language" is still prompt-based guidance. It reduces but never eliminates the failure rate. Classic high-stakes distractor (1.4 Exam Trap).
- **D ✗** — Few-shot examples improve probability but remain probabilistic; they cannot guarantee compliance (1.4 Exam Trap).

---

## Question 2 — Answer: A

**Tests:** 1.3 Subagent Invocation & Context Passing (Rule 3: goals, not procedures).

All three symptoms — rigidity when searches fail, poor handling of emerging topics, and failure to surface tangential sources — are signatures of over-procedural delegation. 1.3 Rule 3: *Design coordinator prompts that specify goals, not procedures. Goal-oriented prompts enable subagent adaptability. Procedural instructions constrain subagents and prevent them from adjusting their approach.*

- **A ✓** — Specifying research goals and quality criteria (coverage breadth, source diversity, recency) and letting the subagent choose its strategy directly addresses all three symptoms at once.
- **B ✗** — A topic-classification routing layer adds complexity and still relies on procedural instructions for the "well-defined" branch; it patches the symptom for some requests rather than fixing the root cause.
- **C ✗** — Fallback directives are still procedural. They might reduce "insufficient results" reports but do nothing for emerging topics or tangential sources.
- **D ✗** — Over-correction. Removing all detail and saying "research X thoroughly" discards the quality criteria that keep output useful. The goal-oriented answer (A) keeps criteria while dropping the step-by-step procedure.

---

## Question 3 — Answer: B

**Tests:** 1.3 (Rule 2: structured data separating content from metadata).

Subagents cite correctly, but the synthesis agent loses the claim→source linkage when merging. The fix is to make the linkage a structured, first-class data object that survives the merge, not something reconstructed afterward.

- **B ✓** — Requiring subagents to emit structured claim-source mappings that the synthesis agent must preserve and merge keeps every claim bound to its source through synthesis. This is the structured-metadata format from 1.3 applied to the synthesis step.
- **A ✗** — Injecting text prefixes and parsing them later is brittle string-hacking; formatting drift or paraphrasing during synthesis breaks the parse.
- **C ✗** — Semantic-similarity reconstruction guesses attributions after they were lost. Reconstruction-after-the-fact is unreliable and the lesson favors preserving metadata, not re-deriving it.
- **D ✗** — Full transcripts plus a citation-resolution agent is heavy log-analysis over-engineering; it fixes the symptom downstream instead of preserving the mapping where it already exists.

---

## Question 4 — Answer: A

**Tests:** 1.7 Session State & Resumption (fresh start + structured summary), 1.2 (coordinator controls context).

The goal is to resume mid-pipeline "balancing information fidelity with context efficiency." 1.7's preferred pattern for restoring state without dragging stale/bloated history is a curated structured summary; 1.2 requires the coordinator to explicitly inject context into each subagent's prompt (subagents are isolated and stateless).

- **A ✓** — Each agent persists a structured report to a known location; on resume the coordinator loads them and injects only the relevant state into agent prompts. Structured reports preserve fidelity; selective injection keeps context lean. This is fresh-start-with-summary executed through the hub-and-spoke coordinator.
- **B ✗** — Persisting the entire coordinator conversation log reintroduces context bloat and stale tool results — exactly what 1.7 warns against.
- **C ✗** — Agents independently maintaining and reloading their own state violates hub-and-spoke (1.2): the coordinator, not the subagents, owns information flow, and subagents do not carry state across invocations.
- **D ✗** — A vector store with semantic retrieval is over-engineered and introduces retrieval imprecision; it cannot guarantee the fidelity that a deterministic structured report gives.

---

## Question 5 — Answer: D

**Tests:** 1.3 (parallel spawning for latency), 1.2 (hub-and-spoke preserves observability).

Two requirements must both be met: reduce latency *and* preserve the coordinator's ability to monitor and debug. 1.3 says independent subtasks should be spawned in parallel (multiple Agent calls in one response). 1.2 says all communication must flow through the coordinator for observability — so any design that hides work below the coordinator fails the second requirement.

- **D ✓** — The coordinator spawns parallel document-analysis subagents over disjoint precedent subsets and aggregates results. Parallelism cuts the 3-minute latency; routing everything through the coordinator preserves monitoring/debugging.
- **A ✗** — A recursive agent hierarchy down to single-precedent granularity buries work in nested layers the coordinator cannot observe; debugging gets harder, not easier.
- **B ✗** — An async message queue with a worker pool decouples execution from the coordinator, breaking centralized observability and consistent error handling.
- **C ✗** — Letting the document-analysis subagent spawn its *own* subagents bypasses the coordinator entirely — a direct violation of the hub-and-spoke isolation rule and the observability requirement.

---

## Question 6 — Answer: A

**Tests:** 1.2 / 1.3 (subagent context isolation).

The single most-tested misconception: subagents do **not** inherit the coordinator's conversation history or other subagents' outputs. If the synthesis agent says it received no findings, the coordinator simply did not put them in its prompt.

- **A ✓** — The coordinator omitted the prior agents' outputs from the synthesis agent's prompt. This is the isolation principle exactly (1.2/1.3).
- **B ✗** — There is no mechanism for one agent to fetch another's conversation history; that history is isolated by design.
- **C ✗** — A context-window limit would manifest as truncation or errors, not "no findings were provided." The agent reports *nothing* arrived, not that too much did.
- **D ✗** — There is no "shared API connection" that auto-shares context between invocations. Invented mechanism.

---

## Question 7 — Answer: B

**Tests:** 1.3 (preserve source characterizations / methodological context), 1.2 (controlled information flow).

The failure is loss of nuance — either collapsing conflicting findings into false confidence or over-hedging into uselessness. The correct fix preserves each source's original characterization and methodology rather than discarding or numerically flattening it.

- **B ✓** — Structuring reports into explicit sections that distinguish well-established from contested findings, while preserving each source's original characterization and methodological context ($50B "methodology varies" vs. $35B ±$7B 95% CI), retains the nuance the current system destroys.
- **A ✗** — Filtering to a high-confidence threshold discards legitimate-but-uncertain findings; information loss, not nuance preservation.
- **C ✗** — Requiring two independent corroborating sources throws away valid single-source findings and treats disagreement as something to suppress rather than represent.
- **D ✗** — Normalizing prose uncertainty into 0.0–1.0 scores and weight-averaging fabricates false precision and averages away exactly the methodological nuance that should be preserved.

---

## Question 8 — Answer: C

**Tests:** 1.3 (the `allowedTools` binary gate).

The symptom is diagnostic: the model *reasons* about delegating ("I'll ask the web search agent…") but no invocation occurs and there are no errors. 1.3 Key Concept: *the coordinator's `allowedTools` must include `"Agent"` (or `"Task"`). This is a binary gate. Without it, the coordinator cannot invoke any subagent regardless of how they are defined.* With the tool absent, the model can only narrate intent in text — precisely what is observed.

- **C ✓** — `allowedTools` lacks `"Task"`/`"Agent"`, so the coordinator can talk about delegating but has no tool to actually spawn subagents.
- **A ✗** — `AgentDefinitions` already provide the descriptions the coordinator uses to choose subagents; the coordinator clearly *knows* they exist (it names them). Knowing about them is not the blocker — being able to invoke them is.
- **B ✗** — A too-low `max_tokens` would truncate output or surface errors, not produce a clean narrate-and-continue with no errors.
- **D ✗** — Context isolation concerns what information *reaches* a subagent once spawned; it does not explain why the spawn never happens at all.

---

## Question 9 — Answer: A

**Tests:** 1.3 (Rule 2: structured data separating content from metadata).

Citations are lost "during the summarization steps." The durable fix is to keep source metadata as structured fields separate from the prose summary, so summarization cannot strip it.

- **A ✓** — Each agent outputs structured data that separates content summaries from source metadata (URLs, document names, page numbers). The metadata travels as its own fields through every step and is available at report generation. Directly matches 1.3 Rule 2 and the structured-metadata format.
- **B ✗** — Passing full raw outputs avoids loss but causes context bloat and does not scale; it sidesteps the principled fix instead of applying it.
- **C ✗** — Having the report generator query the web search agent to re-locate sources is direct inter-agent communication (violates hub-and-spoke) and is fragile after-the-fact reconstruction.
- **D ✗** — Embedding citations inline in free-text summary prose is brittle: the next summarization step can paraphrase or drop them. The lesson explicitly prefers structured separation of content and metadata over inline embedding — this is the key distinction between D (inline, wrong) and A (structured, right).

---

## Question 10 — Answer: B

**Tests:** 1.2 (hub-and-spoke; all communication flows through the coordinator).

Foundational architecture question. Subagents never talk to each other directly and share no memory; the coordinator routes everything.

- **B ✓** — The coordinator receives the web search agent's output and includes the relevant findings in the prompt when it invokes the document analysis agent. This is the cardinal hub-and-spoke rule (1.2).
- **A ✗** — An event-driven message queue with the analysis agent subscribing to events is direct inter-agent coupling that bypasses the coordinator.
- **C ✗** — The web search agent directly invoking the analysis agent is exactly the forbidden direct subagent-to-subagent communication.
- **D ✗** — A shared memory store contradicts the isolation principle: subagents do not share memory or global state (1.2).

---

## Cross-Cutting Patterns

These ten questions reward four reflexes the exam tests repeatedly:

1. **High-stakes (money/security/compliance) → programmatic enforcement, never prompts.** (Q1)
2. **Subagents are isolated and stateless — the coordinator must explicitly pass every input.** (Q4, Q5, Q6, Q10)
3. **Pass structured data that separates content from source metadata; preserve it, don't reconstruct it.** (Q3, Q7, Q9)
4. **Goals over procedures, and trace failures to their origin (usually the coordinator's prompt, decomposition, or tool config) — not the downstream agent.** (Q2, Q8)
