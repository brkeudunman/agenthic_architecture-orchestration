// Practice questions for the Domain 1 quiz section.
// Source of truth: ../../docs/practice/questions.md and ../../docs/practice/answer-key.md
// Prompts and options are copied verbatim from questions.md; `reasoning` is the
// verbatim per-question explanation (intro + per-option bullets) from
// answer-key.md. All three carry markdown (inline `code`, **bold**, *italics*,
// bullet lists) which Quiz.vue renders. Do not paraphrase — keep in sync with
// the source markdown.

export interface QuizOption {
  label: string
  text: string
}

export interface QuizQuestion {
  id: number
  prompt: string
  options: QuizOption[]
  answer: string
  taskStatement: string
  reasoning: string
}

export const questions: QuizQuestion[] = [
  {
    id: 1,
    prompt:
      `Compliance requires that refunds exceeding $500 must automatically escalate to a human agent—this rule cannot be left to model discretion. Despite clear system prompt instructions, production logs show the agent occasionally processes high-value refunds directly (3% failure rate). How should you achieve guaranteed compliance?`,
    options: [
      { label: 'A', text: `Implement a hook to intercept tool calls; when the \`process_refund\` amount exceeds $500, block it and invoke human escalation.` },
      { label: 'B', text: `Modify the refund tool to return an error with message "Amount exceeds policy limit—please escalate" when threshold is exceeded.` },
      { label: 'C', text: `Strengthen the system prompt with emphatic language: "CRITICAL POLICY: Refunds over $500 MUST trigger human escalation. NEVER process these directly."` },
      { label: 'D', text: `Add few-shot examples to the prompt showing correct escalation behavior at various refund amounts ($400, $500, $600).` },
    ],
    answer: 'A',
    taskStatement: '1.4 / 1.5',
    reasoning:
      `A compliance rule with a non-zero failure rate (3%) on a financial operation is the canonical "use programmatic enforcement" scenario. The exam decision rule from 1.4: *if a single failure would cause financial loss, security breach, or compliance violation, use programmatic enforcement.* 1.5 names this exact use case — "A hook intercepts all calls to \`process_refund\`. If the refund amount exceeds $500, the hook blocks the call and redirects to a human escalation workflow."

- **A ✓** — A PreToolUse hook intercepts the call, blocks it deterministically when the amount exceeds $500, and invokes human escalation. Works 100% of the time and satisfies the "automatically escalate to a human agent" requirement.
- **B ✗** — Having the tool return an error is closer to enforcement than a prompt, but it only refuses the action; it does not escalate to a human, and it leaves the policy logic inside the tool's return path rather than at a guaranteed pre-execution gate. It is a weaker, incomplete version of A.
- **C ✗** — "Emphatic language" is still prompt-based guidance. It reduces but never eliminates the failure rate. Classic high-stakes distractor (1.4 Exam Trap).
- **D ✗** — Few-shot examples improve probability but remain probabilistic; they cannot guarantee compliance (1.4 Exam Trap).`,
  },
  {
    id: 2,
    prompt:
      `The coordinator provides detailed step-by-step instructions to the web search subagent, specifying exact search queries, source priorities, and date filters. Production monitoring reveals three issues: (1) the subagent reports "insufficient results" rather than trying alternative approaches when pre-specified searches fail, (2) research quality drops for emerging topics that don't match expected patterns, and (3) the subagent rarely surfaces valuable tangential sources. What's the most effective way to improve subagent adaptability?`,
    options: [
      { label: 'A', text: `Specify research goals and quality criteria (coverage breadth, source diversity, recency) rather than procedural steps, letting the subagent determine its search strategy.` },
      { label: 'B', text: `Implement a topic classification step where the coordinator categorizes requests as "well-defined" or "exploratory" and uses different instruction styles for each category.` },
      { label: 'C', text: `Add explicit fallback directives to the detailed instructions: "If specified searches yield fewer than N results, attempt alternative query formulations before reporting failure."` },
      { label: 'D', text: `Remove procedural details entirely, delegating with simple goals like "research X thoroughly" and relying on the subagent's general capabilities.` },
    ],
    answer: 'A',
    taskStatement: '1.3',
    reasoning:
      `All three symptoms — rigidity when searches fail, poor handling of emerging topics, and failure to surface tangential sources — are signatures of over-procedural delegation. 1.3 Rule 3: *Design coordinator prompts that specify goals, not procedures. Goal-oriented prompts enable subagent adaptability. Procedural instructions constrain subagents and prevent them from adjusting their approach.*

- **A ✓** — Specifying research goals and quality criteria (coverage breadth, source diversity, recency) and letting the subagent choose its strategy directly addresses all three symptoms at once.
- **B ✗** — A topic-classification routing layer adds complexity and still relies on procedural instructions for the "well-defined" branch; it patches the symptom for some requests rather than fixing the root cause.
- **C ✗** — Fallback directives are still procedural. They might reduce "insufficient results" reports but do nothing for emerging topics or tangential sources.
- **D ✗** — Over-correction. Removing all detail and saying "research X thoroughly" discards the quality criteria that keep output useful. The goal-oriented answer (A) keeps criteria while dropping the step-by-step procedure.`,
  },
  {
    id: 3,
    prompt:
      `In production, final reports frequently contain claims without proper source attribution. Investigation shows that while the web search and document analysis agents correctly attach citations to their outputs, the synthesis agent loses track of which sources support which conclusions when combining findings. What's the most effective architectural change?`,
    options: [
      { label: 'A', text: `Have the coordinator inject source identifier prefixes into text before each handoff, then parse these prefixes at report generation to reconstruct citations.` },
      { label: 'B', text: `Require all subagents to output structured claim-source mappings that the synthesis agent must preserve and merge when combining findings from multiple sources.` },
      { label: 'C', text: `Add a verification step where the report generator uses semantic similarity matching against original sources to reconstruct which claims came from which documents.` },
      { label: 'D', text: `Maintain complete transcripts of all subagent interactions and add a citation-resolution agent to analyze logs and determine attributions before report generation.` },
    ],
    answer: 'B',
    taskStatement: '1.3',
    reasoning:
      `Subagents cite correctly, but the synthesis agent loses the claim→source linkage when merging. The fix is to make the linkage a structured, first-class data object that survives the merge, not something reconstructed afterward.

- **B ✓** — Requiring subagents to emit structured claim-source mappings that the synthesis agent must preserve and merge keeps every claim bound to its source through synthesis. This is the structured-metadata format from 1.3 applied to the synthesis step.
- **A ✗** — Injecting text prefixes and parsing them later is brittle string-hacking; formatting drift or paraphrasing during synthesis breaks the parse.
- **C ✗** — Semantic-similarity reconstruction guesses attributions after they were lost. Reconstruction-after-the-fact is unreliable and the lesson favors preserving metadata, not re-deriving it.
- **D ✗** — Full transcripts plus a citation-resolution agent is heavy log-analysis over-engineering; it fixes the symptom downstream instead of preserving the mapping where it already exists.`,
  },
  {
    id: 4,
    prompt:
      `Your multi-agent research pipeline crashed after processing 12 of 28 documents. The web search agent had identified relevant sources, the document analysis agent had partially completed extraction, and the synthesizer had begun pattern identification. You need to resume processing without repeating work or losing fidelity of prior findings. What state management approach best balances information fidelity with context efficiency when restoring agent state?`,
    options: [
      { label: 'A', text: `Have each agent persist a structured report to a known location. On resume, the coordinator loads the reports and injects relevant state into agent prompts.` },
      { label: 'B', text: `Persist the coordinator's conversation log containing all task delegations and responses, providing this to agents when resuming.` },
      { label: 'C', text: `Have each agent maintain its own persistent state file and reload it independently at the start of each session.` },
      { label: 'D', text: `Index all agent outputs in a shared vector store. When resuming, each agent queries the store using semantic similarity search to retrieve relevant prior findings.` },
    ],
    answer: 'A',
    taskStatement: '1.7 / 1.2',
    reasoning:
      `The goal is to resume mid-pipeline "balancing information fidelity with context efficiency." 1.7's preferred pattern for restoring state without dragging stale/bloated history is a curated structured summary; 1.2 requires the coordinator to explicitly inject context into each subagent's prompt (subagents are isolated and stateless).

- **A ✓** — Each agent persists a structured report to a known location; on resume the coordinator loads them and injects only the relevant state into agent prompts. Structured reports preserve fidelity; selective injection keeps context lean. This is fresh-start-with-summary executed through the hub-and-spoke coordinator.
- **B ✗** — Persisting the entire coordinator conversation log reintroduces context bloat and stale tool results — exactly what 1.7 warns against.
- **C ✗** — Agents independently maintaining and reloading their own state violates hub-and-spoke (1.2): the coordinator, not the subagents, owns information flow, and subagents do not carry state across invocations.
- **D ✗** — A vector store with semantic retrieval is over-engineered and introduces retrieval imprecision; it cannot guarantee the fidelity that a deterministic structured report gives.`,
  },
  {
    id: 5,
    prompt:
      `When analyzing complex legal cases that cite multiple precedents, the document analysis subagent processes each sequentially. A landmark case citing 12 precedents takes over 3 minutes to analyze completely. What's the most effective way to reduce this latency while preserving the coordinator's ability to monitor and debug the system?`,
    options: [
      { label: 'A', text: `Create a recursive agent hierarchy where analysis agents subdivide work among child agents until reaching single-precedent granularity.` },
      { label: 'B', text: `Implement a message queue where precedent analysis tasks are processed asynchronously by a pool of worker agents.` },
      { label: 'C', text: `Enable the document analysis subagent to spawn its own specialized subagents dynamically when it encounters cases with many citations.` },
      { label: 'D', text: `Have the coordinator spawn parallel document analysis subagents, each handling a subset of precedents, then aggregate results before synthesis.` },
    ],
    answer: 'D',
    taskStatement: '1.3 / 1.2',
    reasoning:
      `Two requirements must both be met: reduce latency *and* preserve the coordinator's ability to monitor and debug. 1.3 says independent subtasks should be spawned in parallel (multiple Agent calls in one response). 1.2 says all communication must flow through the coordinator for observability — so any design that hides work below the coordinator fails the second requirement.

- **D ✓** — The coordinator spawns parallel document-analysis subagents over disjoint precedent subsets and aggregates results. Parallelism cuts the 3-minute latency; routing everything through the coordinator preserves monitoring/debugging.
- **A ✗** — A recursive agent hierarchy down to single-precedent granularity buries work in nested layers the coordinator cannot observe; debugging gets harder, not easier.
- **B ✗** — An async message queue with a worker pool decouples execution from the coordinator, breaking centralized observability and consistent error handling.
- **C ✗** — Letting the document-analysis subagent spawn its *own* subagents bypasses the coordinator entirely — a direct violation of the hub-and-spoke isolation rule and the observability requirement.`,
  },
  {
    id: 6,
    prompt:
      `After the web search agent and document analysis agent complete their tasks, the coordinator invokes the synthesis agent. However, the synthesis agent responds that it cannot complete the task because no research findings were provided. What is the most likely cause of this issue?`,
    options: [
      { label: 'A', text: `The coordinator did not include the outputs from the previous agents in the synthesis agent's prompt.` },
      { label: 'B', text: `The synthesis agent needs tools that can fetch results directly from the other agents' conversation histories.` },
      { label: 'C', text: `The synthesis agent's context window is not large enough to hold the combined outputs from both previous agents.` },
      { label: 'D', text: `The subagents need to share a single API connection to enable automatic context sharing between invocations.` },
    ],
    answer: 'A',
    taskStatement: '1.2 / 1.3',
    reasoning:
      `The single most-tested misconception: subagents do **not** inherit the coordinator's conversation history or other subagents' outputs. If the synthesis agent says it received no findings, the coordinator simply did not put them in its prompt.

- **A ✓** — The coordinator omitted the prior agents' outputs from the synthesis agent's prompt. This is the isolation principle exactly (1.2/1.3).
- **B ✗** — There is no mechanism for one agent to fetch another's conversation history; that history is isolated by design.
- **C ✗** — A context-window limit would manifest as truncation or errors, not "no findings were provided." The agent reports *nothing* arrived, not that too much did.
- **D ✗** — There is no "shared API connection" that auto-shares context between invocations. Invented mechanism.`,
  },
  {
    id: 7,
    prompt:
      `Production reviews reveal inconsistent handling of uncertainty in final reports. Sometimes conflicting subagent findings are synthesized into a single confident statement (losing nuance), while other times reports over-hedge with excessive qualifications (becoming unhelpful). When the web search agent returns "industry analysts estimate $50B market size (methodology varies)" and the document analysis agent returns "peer-reviewed study estimates $35B (±$7B, 95% CI)," the coordinator either picks one arbitrarily or produces vague statements like "the market may be $35B–$50B depending on factors." What systematic approach best addresses this?`,
    options: [
      { label: 'A', text: `Configure subagents to only report findings meeting a high-confidence threshold, filtering uncertain information before it reaches the coordinator.` },
      { label: 'B', text: `Instruct the synthesis agent to structure reports with explicit sections distinguishing well-established findings from contested ones, preserving original source characterizations and methodological context.` },
      { label: 'C', text: `Add a verification subagent that cross-references findings across sources, only passing claims to synthesis that are corroborated by at least two independent sources.` },
      { label: 'D', text: `Implement a confidence calibration layer that normalizes subagent uncertainty expressions to standardized probability scores (0.0–1.0), then weight-average findings by their calibrated confidence.` },
    ],
    answer: 'B',
    taskStatement: '1.3 / 1.2',
    reasoning:
      `The failure is loss of nuance — either collapsing conflicting findings into false confidence or over-hedging into uselessness. The correct fix preserves each source's original characterization and methodology rather than discarding or numerically flattening it.

- **B ✓** — Structuring reports into explicit sections that distinguish well-established from contested findings, while preserving each source's original characterization and methodological context ($50B "methodology varies" vs. $35B ±$7B 95% CI), retains the nuance the current system destroys.
- **A ✗** — Filtering to a high-confidence threshold discards legitimate-but-uncertain findings; information loss, not nuance preservation.
- **C ✗** — Requiring two independent corroborating sources throws away valid single-source findings and treats disagreement as something to suppress rather than represent.
- **D ✗** — Normalizing prose uncertainty into 0.0–1.0 scores and weight-averaging fabricates false precision and averages away exactly the methodological nuance that should be preserved.`,
  },
  {
    id: 8,
    prompt:
      `The coordinator agent has \`AgentDefinitions\` configured for all four specialized subagents, each with appropriate descriptions, prompts, and tool restrictions. During testing, you notice the coordinator correctly reasons about when to delegate—it generates messages like "I'll ask the web search agent to find sources on this topic"—but no subagent execution ever occurs. The coordinator then proceeds as if the delegation happened and continues with incomplete information. Logs show no errors. What is the most likely cause?`,
    options: [
      { label: 'A', text: `The \`AgentDefinitions\` are configured correctly, but the coordinator's system prompt doesn't explicitly list the available subagent types, preventing the model from knowing they can be invoked.` },
      { label: 'B', text: `The coordinator's \`max_tokens\` setting is too low, causing the \`Task\` tool invocation to be truncated before the subagent type parameter can be specified.` },
      { label: 'C', text: `The coordinator's \`allowedTools\` configuration doesn't include \`"Task"\`, so while it can reason about delegation, it cannot invoke the tool required to spawn subagents.` },
      { label: 'D', text: `Subagent context isolation means task descriptions from the coordinator don't automatically reach subagents; you need to configure explicit context forwarding in \`ClaudeAgentOptions\`.` },
    ],
    answer: 'C',
    taskStatement: '1.3',
    reasoning:
      `The symptom is diagnostic: the model *reasons* about delegating ("I'll ask the web search agent…") but no invocation occurs and there are no errors. 1.3 Key Concept: *the coordinator's \`allowedTools\` must include \`"Agent"\` (or \`"Task"\`). This is a binary gate. Without it, the coordinator cannot invoke any subagent regardless of how they are defined.* With the tool absent, the model can only narrate intent in text — precisely what is observed.

- **C ✓** — \`allowedTools\` lacks \`"Task"\`/\`"Agent"\`, so the coordinator can talk about delegating but has no tool to actually spawn subagents.
- **A ✗** — \`AgentDefinitions\` already provide the descriptions the coordinator uses to choose subagents; the coordinator clearly *knows* they exist (it names them). Knowing about them is not the blocker — being able to invoke them is.
- **B ✗** — A too-low \`max_tokens\` would truncate output or surface errors, not produce a clean narrate-and-continue with no errors.
- **D ✗** — Context isolation concerns what information *reaches* a subagent once spawned; it does not explain why the spawn never happens at all.`,
  },
  {
    id: 9,
    prompt:
      `The synthesis agent receives summarized findings from the web search and document analysis agents, then passes a consolidated summary to the report generator. During testing, you discover the generated reports make factual claims without proper citations—the report generator cannot attribute statements to their original sources because that metadata was lost during the summarization steps. What's the most effective approach to ensure proper source attribution in the final reports?`,
    options: [
      { label: 'A', text: `Have each agent output structured data separating content summaries from source metadata (URLs, document names, page numbers).` },
      { label: 'B', text: `Skip summarization and pass full raw outputs from web search and document analysis directly to the report generator.` },
      { label: 'C', text: `Have the report generator query the web search agent to re-locate sources for claims in the final report.` },
      { label: 'D', text: `Instruct the synthesis agent to embed source references inline within its summary text using a consistent citation format.` },
    ],
    answer: 'A',
    taskStatement: '1.3',
    reasoning:
      `Citations are lost "during the summarization steps." The durable fix is to keep source metadata as structured fields separate from the prose summary, so summarization cannot strip it.

- **A ✓** — Each agent outputs structured data that separates content summaries from source metadata (URLs, document names, page numbers). The metadata travels as its own fields through every step and is available at report generation. Directly matches 1.3 Rule 2 and the structured-metadata format.
- **B ✗** — Passing full raw outputs avoids loss but causes context bloat and does not scale; it sidesteps the principled fix instead of applying it.
- **C ✗** — Having the report generator query the web search agent to re-locate sources is direct inter-agent communication (violates hub-and-spoke) and is fragile after-the-fact reconstruction.
- **D ✗** — Embedding citations inline in free-text summary prose is brittle: the next summarization step can paraphrase or drop them. The lesson explicitly prefers structured separation of content and metadata over inline embedding — this is the key distinction between D (inline, wrong) and A (structured, right).`,
  },
  {
    id: 10,
    prompt:
      `The web search agent has gathered several relevant sources for a research topic. The document analysis agent now needs to examine these sources. How does information typically flow between these two specialized subagents?`,
    options: [
      { label: 'A', text: `The agents communicate through an event-driven message queue, with the document analysis agent subscribing to web search completion events.` },
      { label: 'B', text: `The coordinator agent receives the web search agent's output and includes relevant findings in the prompt when invoking the document analysis agent.` },
      { label: 'C', text: `The web search agent directly invokes the document analysis agent, passing the discovered sources as parameters.` },
      { label: 'D', text: `Both agents access a shared memory store where the web search agent writes findings and the document analysis agent reads them.` },
    ],
    answer: 'B',
    taskStatement: '1.2',
    reasoning:
      `Foundational architecture question. Subagents never talk to each other directly and share no memory; the coordinator routes everything.

- **B ✓** — The coordinator receives the web search agent's output and includes the relevant findings in the prompt when it invokes the document analysis agent. This is the cardinal hub-and-spoke rule (1.2).
- **A ✗** — An event-driven message queue with the analysis agent subscribing to events is direct inter-agent coupling that bypasses the coordinator.
- **C ✗** — The web search agent directly invoking the analysis agent is exactly the forbidden direct subagent-to-subagent communication.
- **D ✗** — A shared memory store contradicts the isolation principle: subagents do not share memory or global state (1.2).`,
  },
]
