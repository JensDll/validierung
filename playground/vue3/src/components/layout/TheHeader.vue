<script lang="ts">
import { defineComponent } from 'vue'

import { useNavStore } from '~/modules/pinia'

export default defineComponent({
  setup() {
    const navStore = useNavStore()

    return {
      navStore
    }
  }
})
</script>

<template>
  <header class="border-b py-4">
    <div
      class="flex items-center justify-between px-6 md:px-9 lg:container lg:mx-auto lg:px-12"
    >
      <div class="flex items-center">
        <div
          class="i-heroicons-solid-menu mr-4 h-6 w-6 cursor-pointer hover:text-gray-800 lg:hidden"
          @click="navStore.toggleNav()"
        ></div>
        <div class="text-lg font-semibold">Vue 3 Playground</div>
      </div>
      <a
        class="text-indigo-600 hover:text-indigo-800"
        href="https://github.com/JensDll/validierung/tree/main"
      >
        GitHub
      </a>
    </div>
  </header>
</template>

<style lang="postcss" scoped></style>
