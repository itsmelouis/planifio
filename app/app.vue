<script setup lang="ts">
import Toaster from '@/components/ui/toast/Toaster.vue'
</script>

<template>
  <Toaster />
  <NuxtLayout>
    <NuxtPwaManifest />
    <NuxtPage />
  </NuxtLayout>
</template>
