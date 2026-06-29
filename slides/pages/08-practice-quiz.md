---
layout: section
---

# 🧪 Practice Quiz

10 exam-style questions · click an option to grade it and reveal the reasoning

---
layout: default
---

## Question 1

<Quiz v-bind="$questions[0]" />

---
layout: default
---

## Question 2

<Quiz v-bind="$questions[1]" />

---
layout: default
---

## Question 3

<Quiz v-bind="$questions[2]" />

---
layout: default
---

## Question 4

<Quiz v-bind="$questions[3]" />

---
layout: default
---

## Question 5

<Quiz v-bind="$questions[4]" />

---
layout: default
---

## Question 6

<Quiz v-bind="$questions[5]" />

---
layout: default
---

## Question 7

<Quiz v-bind="$questions[6]" />

---
layout: default
---

## Question 8

<Quiz v-bind="$questions[7]" />

---
layout: default
---

## Question 9

<Quiz v-bind="$questions[8]" />

---
layout: default
---

## Question 10

<Quiz v-bind="$questions[9]" />

---
layout: default
---

## Cross-cutting patterns

Four reflexes the exam rewards repeatedly:

<v-clicks>

1. **High-stakes (money / security / compliance) → programmatic enforcement, never prompts.** *(Q1)*
2. **Subagents are isolated and stateless — the coordinator must explicitly pass every input.** *(Q4, Q5, Q6, Q10)*
3. **Pass structured data separating content from source metadata; preserve it, don't reconstruct it.** *(Q3, Q7, Q9)*
4. **Goals over procedures — and trace failures to their origin (coordinator prompt, decomposition, or tool config), not the downstream agent.** *(Q2, Q8)*

</v-clicks>
