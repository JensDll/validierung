<script setup lang="ts">
import { getCurrentInstance } from '@vue/composition-api'

const instance = getCurrentInstance()
const router = instance!.root.proxy.$router

const routes = router
  .getRoutes()
  .filter(route => route.meta.title !== undefined)
</script>

<template>
  <div>
    <header class="mb-12 py-6">
      <nav class="container space-x-4">
        <RouterLink
          v-for="route in routes"
          :to="{ name: route.name }"
          :key="route.name"
          >{{ route.meta.title }}</RouterLink
        >
      </nav>
    </header>
    <main class="pb-24">
      <RouterView></RouterView>
    </main>
  </div>
</template>

<style></style>
