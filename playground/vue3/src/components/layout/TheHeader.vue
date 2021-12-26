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
    <div class="lg:container lg:mx-auto">
      <div>Vue 3 Playground</div>
      <div class="lg:hidden" @click="navStore.toggleNav()">Open Nav</div>
    </div>
  </header>
</template>

<style lang="postcss" scoped></style>
