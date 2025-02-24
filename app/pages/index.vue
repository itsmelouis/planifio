<script setup lang="ts">
import { Button } from '@/components/ui/button'
const router = useRouter();
</script>

<template>
  <Button @click="router.go('about')">Button</Button>
</template>
