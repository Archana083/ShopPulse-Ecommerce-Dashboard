<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from './layouts/AppLayout.vue'

const route = useRoute()
const isAuthPage = computed(() => ['/login', '/register', '/forgot-password'].includes(route.path))
</script>
<template>
  <AppLayout v-if="!isAuthPage" />
  <RouterView v-else />
</template>
