<script setup lang="ts">
withDefaults(defineProps<{ title?: string }>(), { title: 'Key Concept' })
</script>

<template>
  <div class="key-concept">
    <div class="key-concept__label">
      <span class="key-concept__icon">◆</span> {{ title }}
    </div>
    <div class="key-concept__body">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.key-concept {
  border-left: 4px solid var(--tech-blue);
  background: var(--tech-blue-tint);
  border-radius: 0.4rem;
  padding: 0.5rem 0.85rem;
  margin: 0.45rem 0;
}
.key-concept__label {
  font-weight: 700;
  color: var(--tech-blue-strong);
  font-size: 0.88rem;
  margin-bottom: 0.15rem;
}
.key-concept__icon {
  margin-right: 0.15rem;
}
.key-concept__body {
  font-size: 0.88rem;
  line-height: 1.4;
}
.dark .key-concept__label {
  color: var(--tech-blue-bright);
}
</style>
