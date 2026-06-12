<script setup lang="ts">
import { useSeoMeta } from '@unhead/vue'

useSeoMeta({
  title: 'Page not found | RULA',
  robots: 'noindex',
})
</script>

<template>
  <div class="container page">
    <h1>Page not found</h1>
    <p class="muted">The page you were looking for doesn't exist or has moved.</p>
    <RouterLink to="/" class="btn btn--primary">Go to the assessments</RouterLink>
  </div>
</template>
