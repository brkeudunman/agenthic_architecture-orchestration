<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<template>
  <div class="exam-trap">
    <div class="exam-trap__label">
      <span class="exam-trap__icon">⚠</span> Exam Trap — {{ title }}
    </div>
    <div class="exam-trap__body">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.exam-trap {
  border-left: 4px solid var(--tech-warn-line);
  background: var(--tech-warn-tint);
  border-radius: 0.4rem;
  padding: 0.45rem 0.85rem;
  margin: 0.4rem 0;
}
.exam-trap__label {
  font-weight: 700;
  color: var(--tech-warn);
  font-size: 0.88rem;
  margin-bottom: 0.15rem;
}
.exam-trap__icon {
  margin-right: 0.15rem;
}
.exam-trap__body {
  font-size: 0.82rem;
  line-height: 1.35;
  opacity: 0.92;
}
:deep(.dark) .exam-trap__label,
.dark .exam-trap__label {
  color: var(--tech-warn-bright);
}
</style>
