<script setup lang="ts">
import ThemeToggle from './ThemeToggle.vue'
</script>

<template>
  <header class="site-header">
    <div class="container site-header__inner">
      <RouterLink to="/" class="brand">
        <img src="/media/manikin_logo.png" alt="" width="38" height="38" />
        <strong>RULA</strong>
        <span>Rapid Upper Limb Assessment</span>
      </RouterLink>
      <nav class="site-nav" aria-label="Main">
        <RouterLink to="/">Assess</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/contact">Contact</RouterLink>
      </nav>
      <ThemeToggle />
    </div>
  </header>
</template>
