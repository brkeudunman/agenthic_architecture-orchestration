<script setup lang="ts">
import { ref, computed } from 'vue'
import MarkdownIt from 'markdown-it'

// Prompts, options, and reasoning are stored verbatim from docs/practice/*.md,
// so they carry markdown (inline `code`, **bold**, *italics*, bullet lists).
// Render it here so the deck shows the same formatting as the source files
// instead of raw markdown characters.
const md = new MarkdownIt({ html: false, linkify: true })
const renderInline = (s: string) => md.renderInline(s)
const renderBlock = (s: string) => md.render(s)

interface QuizOption {
  label: string
  text: string
}

const props = defineProps<{
  id: string | number
  prompt: string
  options: QuizOption[]
  answer: string
  taskStatement: string
  reasoning: string
}>()

const selected = ref<string | null>(null)
const revealed = computed(() => selected.value !== null)

function choose(label: string) {
  if (selected.value === null) selected.value = label
}

function reset() {
  selected.value = null
}

function stateFor(label: string): string {
  if (!revealed.value) return 'idle'
  if (label === props.answer) return 'correct'
  if (label === selected.value) return 'wrong'
  return 'dim'
}
</script>

<template>
  <div class="quiz">
    <div class="quiz__head">
      <span class="quiz__tag">Q{{ id }}</span>
      <span class="quiz__statement">Tests: {{ taskStatement }}</span>
    </div>

    <p class="quiz__prompt" v-html="renderInline(prompt)" />

    <ul class="quiz__options">
      <li
        v-for="opt in options"
        :key="opt.label"
        class="quiz__option"
        :class="stateFor(opt.label)"
        @click="choose(opt.label)"
      >
        <span class="quiz__label">{{ opt.label }}</span>
        <span class="quiz__text" v-html="renderInline(opt.text)" />
        <span v-if="revealed && opt.label === answer" class="quiz__mark">✓</span>
        <span v-else-if="revealed && opt.label === selected" class="quiz__mark">✗</span>
      </li>
    </ul>

    <transition name="fade">
      <div v-if="revealed" class="quiz__explain">
        <p class="quiz__verdict">
          <strong>Answer: {{ answer }}.</strong>
          <button class="quiz__reset" @click="reset">Try again</button>
        </p>
        <div class="quiz__reasoning" v-html="renderBlock(reasoning)" />
      </div>
    </transition>
    <p v-if="!revealed" class="quiz__hint">Click an option to answer.</p>
  </div>
</template>

<style scoped>
.quiz {
  font-size: 0.85rem;
}
.quiz__head {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.4rem;
}
.quiz__tag {
  background: var(--tech-primary);
  color: #fff;
  border-radius: 0.3rem;
  padding: 0.1rem 0.5rem;
  font-weight: 700;
  font-size: 0.8rem;
}
.quiz__statement {
  font-size: 0.78rem;
  opacity: 0.6;
}
.quiz__prompt {
  font-size: 0.92rem;
  line-height: 1.3;
  margin: 0.15rem 0 0.55rem;
}
.quiz__options {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.quiz__option {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.38rem 0.65rem;
  border: 1px solid rgba(127, 127, 127, 0.3);
  border-radius: 0.45rem;
  cursor: pointer;
  font-size: 0.82rem;
  line-height: 1.3;
  transition: all 0.15s ease;
}
.quiz__option.idle:hover {
  border-color: var(--tech-primary);
  background: var(--tech-primary-tint);
}
.quiz__option.correct {
  border-color: var(--tech-ok);
  background: var(--tech-ok-tint);
}
.quiz__option.wrong {
  border-color: var(--tech-bad);
  background: var(--tech-bad-tint);
}
.quiz__option.dim {
  opacity: 0.5;
}
.quiz__label {
  font-weight: 700;
  color: var(--tech-primary-strong);
}
.quiz__text {
  flex: 1;
}
.quiz__mark {
  font-weight: 700;
}
.quiz__option.correct .quiz__mark {
  color: var(--tech-ok);
}
.quiz__option.wrong .quiz__mark {
  color: var(--tech-bad);
}
.quiz__explain {
  margin-top: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.45rem;
  background: var(--tech-primary-tint);
  border-left: 4px solid var(--tech-primary);
  font-size: 0.82rem;
  line-height: 1.35;
}
.quiz__verdict {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin: 0 0 0.35rem;
}
.quiz__reasoning :deep(p) {
  margin: 0 0 0.4rem;
}
.quiz__reasoning :deep(ul) {
  margin: 0.2rem 0 0;
  padding-left: 1.15rem;
}
.quiz__reasoning :deep(li) {
  margin: 0.15rem 0;
}
.quiz__reasoning :deep(li)::marker {
  color: var(--tech-primary-strong);
}
.quiz__prompt :deep(code),
.quiz__text :deep(code),
.quiz__reasoning :deep(code) {
  font-family: var(--slidev-code-font-family, ui-monospace, monospace);
  font-size: 0.9em;
  background: rgba(127, 127, 127, 0.18);
  padding: 0.05rem 0.3rem;
  border-radius: 0.25rem;
}
.dark .quiz__label {
  color: var(--tech-primary-bright);
}
.quiz__reset {
  margin-left: 0.6rem;
  font-size: 0.75rem;
  padding: 0.1rem 0.5rem;
  border-radius: 0.3rem;
  border: 1px solid rgba(127, 127, 127, 0.4);
  background: transparent;
  cursor: pointer;
}
.quiz__hint {
  margin-top: 0.6rem;
  font-size: 0.78rem;
  opacity: 0.55;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
