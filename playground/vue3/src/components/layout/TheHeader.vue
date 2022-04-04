<script lang="ts">
import { defineComponent } from 'vue'

import { useNavStore } from '~/modules/pinia'
import AppIcon from '~/components/app/AppIcon.vue'

export default defineComponent({
  components: {
    AppIcon
  },
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
      class="px-6 flex items-center justify-between md:px-9 lg:px-12 lg:container lg:mx-auto"
    >
      <div class="flex items-center">
        <AppIcon
          icon="Menu"
          class="w-6 h-6 mr-4 cursor-pointer hover:text-gray-800 lg:hidden"
          @click="navStore.toggleNav()"
        />
        <div class="font-semibold text-lg">Vue 3 Playground</div>
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
