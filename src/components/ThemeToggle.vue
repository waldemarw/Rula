<script setup lang="ts">
// Stateless on purpose: the current theme lives on <html data-theme>, set by
// the inline script in index.html before hydration. The two icons swap via
// CSS, so server-rendered markup never mismatches the client.
function toggleTheme() {
  const root = document.documentElement
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark'
  root.dataset.theme = next
  try {
    localStorage.setItem('rula-theme', next)
  } catch {
    /* private browsing — theme just won't persist */
  }
}
</script>

<template>
  <button class="theme-toggle" type="button" aria-label="Toggle dark mode" @click="toggleTheme">
    <span class="icon-moon" aria-hidden="true">🌙</span>
    <span class="icon-sun" aria-hidden="true">☀️</span>
  </button>
</template>
