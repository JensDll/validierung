<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const routes = router
  .getRoutes()
  .filter(route => route.meta.title !== undefined)
</script>

<template>
  <header class="mb-12 border-b py-6 xl:mx-auto xl:max-w-6xl">
    <nav class="container space-x-4">
      <RouterLink v-for="route in routes" :to="{ name: route.name }">{{
        route.meta.title
      }}</RouterLink>
    </nav>
  </header>
  <main class="pb-24">
    <RouterView></RouterView>
  </main>
</template>

<style></style>
