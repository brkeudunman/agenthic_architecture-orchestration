## Question 1

Compliance requires that refunds exceeding $500 must automatically escalate to a human agent—this rule cannot be left to model discretion. Despite clear system prompt instructions, production logs show the agent occasionally processes high-value refunds directly (3% failure rate). How should you achieve guaranteed compliance?

**Option A** — Implement a hook to intercept tool calls; when the `process_refund` amount exceeds $500, block it and invoke human escalation.

**Option B** — Modify the refund tool to return an error with message "Amount exceeds policy limit—please escalate" when threshold is exceeded.

**Option C** — Strengthen the system prompt with emphatic language: "CRITICAL POLICY: Refunds over $500 MUST trigger human escalation. NEVER process these directly."

**Option D** — Add few-shot examples to the prompt showing correct escalation behavior at various refund amounts ($400, $500, $600).

---

## Question 2

The coordinator provides detailed step-by-step instructions to the web search subagent, specifying exact search queries, source priorities, and date filters. Production monitoring reveals three issues: (1) the subagent reports "insufficient results" rather than trying alternative approaches when pre-specified searches fail, (2) research quality drops for emerging topics that don't match expected patterns, and (3) the subagent rarely surfaces valuable tangential sources. What's the most effective way to improve subagent adaptability?

**Option A** — Specify research goals and quality criteria (coverage breadth, source diversity, recency) rather than procedural steps, letting the subagent determine its search strategy.

**Option B** — Implement a topic classification step where the coordinator categorizes requests as "well-defined" or "exploratory" and uses different instruction styles for each category.

**Option C** — Add explicit fallback directives to the detailed instructions: "If specified searches yield fewer than N results, attempt alternative query formulations before reporting failure."

**Option D** — Remove procedural details entirely, delegating with simple goals like "research X thoroughly" and relying on the subagent's general capabilities.

---

## Question 3

In production, final reports frequently contain claims without proper source attribution. Investigation shows that while the web search and document analysis agents correctly attach citations to their outputs, the synthesis agent loses track of which sources support which conclusions when combining findings. What's the most effective architectural change?

**Option A** — Have the coordinator inject source identifier prefixes into text before each handoff, then parse these prefixes at report generation to reconstruct citations.

**Option B** — Require all subagents to output structured claim-source mappings that the synthesis agent must preserve and merge when combining findings from multiple sources.

**Option C** — Add a verification step where the report generator uses semantic similarity matching against original sources to reconstruct which claims came from which documents.

**Option D** — Maintain complete transcripts of all subagent interactions and add a citation-resolution agent to analyze logs and determine attributions before report generation.

---

## Question 4

Your multi-agent research pipeline crashed after processing 12 of 28 documents. The web search agent had identified relevant sources, the document analysis agent had partially completed extraction, and the synthesizer had begun pattern identification. You need to resume processing without repeating work or losing fidelity of prior findings. What state management approach best balances information fidelity with context efficiency when restoring agent state?

**Option A** — Have each agent persist a structured report to a known location. On resume, the coordinator loads the reports and injects relevant state into agent prompts.

**Option B** — Persist the coordinator's conversation log containing all task delegations and responses, providing this to agents when resuming.

**Option C** — Have each agent maintain its own persistent state file and reload it independently at the start of each session.

**Option D** — Index all agent outputs in a shared vector store. When resuming, each agent queries the store using semantic similarity search to retrieve relevant prior findings.

---

## Question 5

When analyzing complex legal cases that cite multiple precedents, the document analysis subagent processes each sequentially. A landmark case citing 12 precedents takes over 3 minutes to analyze completely. What's the most effective way to reduce this latency while preserving the coordinator's ability to monitor and debug the system?

**Option A** — Create a recursive agent hierarchy where analysis agents subdivide work among child agents until reaching single-precedent granularity.

**Option B** — Implement a message queue where precedent analysis tasks are processed asynchronously by a pool of worker agents.

**Option C** — Enable the document analysis subagent to spawn its own specialized subagents dynamically when it encounters cases with many citations.

**Option D** — Have the coordinator spawn parallel document analysis subagents, each handling a subset of precedents, then aggregate results before synthesis.

---

## Question 6

After the web search agent and document analysis agent complete their tasks, the coordinator invokes the synthesis agent. However, the synthesis agent responds that it cannot complete the task because no research findings were provided. What is the most likely cause of this issue?

**Option A** — The coordinator did not include the outputs from the previous agents in the synthesis agent's prompt.

**Option B** — The synthesis agent needs tools that can fetch results directly from the other agents' conversation histories.

**Option C** — The synthesis agent's context window is not large enough to hold the combined outputs from both previous agents.

**Option D** — The subagents need to share a single API connection to enable automatic context sharing between invocations.

---

## Question 7

Production reviews reveal inconsistent handling of uncertainty in final reports. Sometimes conflicting subagent findings are synthesized into a single confident statement (losing nuance), while other times reports over-hedge with excessive qualifications (becoming unhelpful). When the web search agent returns "industry analysts estimate $50B market size (methodology varies)" and the document analysis agent returns "peer-reviewed study estimates $35B (±$7B, 95% CI)," the coordinator either picks one arbitrarily or produces vague statements like "the market may be $35B–$50B depending on factors." What systematic approach best addresses this?

**Option A** — Configure subagents to only report findings meeting a high-confidence threshold, filtering uncertain information before it reaches the coordinator.

**Option B** — Instruct the synthesis agent to structure reports with explicit sections distinguishing well-established findings from contested ones, preserving original source characterizations and methodological context.

**Option C** — Add a verification subagent that cross-references findings across sources, only passing claims to synthesis that are corroborated by at least two independent sources.

**Option D** — Implement a confidence calibration layer that normalizes subagent uncertainty expressions to standardized probability scores (0.0–1.0), then weight-average findings by their calibrated confidence.

---

## Question 8

The coordinator agent has `AgentDefinitions` configured for all four specialized subagents, each with appropriate descriptions, prompts, and tool restrictions. During testing, you notice the coordinator correctly reasons about when to delegate—it generates messages like "I'll ask the web search agent to find sources on this topic"—but no subagent execution ever occurs. The coordinator then proceeds as if the delegation happened and continues with incomplete information. Logs show no errors. What is the most likely cause?

**Option A** — The `AgentDefinitions` are configured correctly, but the coordinator's system prompt doesn't explicitly list the available subagent types, preventing the model from knowing they can be invoked.

**Option B** — The coordinator's `max_tokens` setting is too low, causing the `Task` tool invocation to be truncated before the subagent type parameter can be specified.

**Option C** — The coordinator's `allowedTools` configuration doesn't include `"Task"`, so while it can reason about delegation, it cannot invoke the tool required to spawn subagents.

**Option D** — Subagent context isolation means task descriptions from the coordinator don't automatically reach subagents; you need to configure explicit context forwarding in `ClaudeAgentOptions`.

---

## Question 9

The synthesis agent receives summarized findings from the web search and document analysis agents, then passes a consolidated summary to the report generator. During testing, you discover the generated reports make factual claims without proper citations—the report generator cannot attribute statements to their original sources because that metadata was lost during the summarization steps. What's the most effective approach to ensure proper source attribution in the final reports?

**Option A** — Have each agent output structured data separating content summaries from source metadata (URLs, document names, page numbers).

**Option B** — Skip summarization and pass full raw outputs from web search and document analysis directly to the report generator.

**Option C** — Have the report generator query the web search agent to re-locate sources for claims in the final report.

**Option D** — Instruct the synthesis agent to embed source references inline within its summary text using a consistent citation format.

---

## Question 10

The web search agent has gathered several relevant sources for a research topic. The document analysis agent now needs to examine these sources. How does information typically flow between these two specialized subagents?

**Option A** — The agents communicate through an event-driven message queue, with the document analysis agent subscribing to web search completion events.

**Option B** — The coordinator agent receives the web search agent's output and includes relevant findings in the prompt when invoking the document analysis agent.

**Option C** — The web search agent directly invokes the document analysis agent, passing the discovered sources as parameters.

**Option D** — Both agents access a shared memory store where the web search agent writes findings and the document analysis agent reads them.
