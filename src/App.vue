<script setup lang="ts">
import { useHead } from '@unhead/vue'
import SiteHeader from '@/components/SiteHeader.vue'
import SiteFooter from '@/components/SiteFooter.vue'
// ?url imports resolve to the same hashed assets the @fontsource CSS points
// at, so these preloads warm exactly the files the page will use.
import lato400 from '@fontsource/lato/files/lato-latin-400-normal.woff2?url'
import lato700 from '@fontsource/lato/files/lato-latin-700-normal.woff2?url'

useHead({
  htmlAttrs: { lang: 'en' },
  link: [
    { rel: 'preload', href: lato400, as: 'font', type: 'font/woff2', crossorigin: '' },
    { rel: 'preload', href: lato700, as: 'font', type: 'font/woff2', crossorigin: '' },
  ],
})
</script>

<template>
  <div class="site">
    <SiteHeader />
    <main class="site-main">
      <RouterView />
    </main>
    <SiteFooter />
  </div>
</template>
