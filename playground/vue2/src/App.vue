<script setup lang="ts"></script>

<template>
  <div class="prose lg:prose-lg mx-auto w-full">
    <header class="mb-12 py-6">
      <nav class="container space-x-4">
        <RouterLink
          v-for="route in $router.getRoutes().filter(route => route.name)"
          :to="{ name: route.name }"
          :key="route.name"
        >
          {{ route.meta.title }}
        </RouterLink>
      </nav>
    </header>
    <main class="pb-24">
      <RouterView></RouterView>
    </main>
  </div>
</template>

<style></style>
