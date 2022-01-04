<script lang="ts">
import { defineComponent } from '@vue/composition-api'

import { useNavStore } from '~/modules/pinia'
import MenuIcon from '~/components/icon/MenuIcon.vue'

export default defineComponent({
  components: {
    MenuIcon
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
      class="px-6 flex items-center justify-between lg:px-12 lg:container lg:mx-auto"
    >
      <div class="flex items-center">
        <MenuIcon
          class="w-6 h-6 mr-4 cursor-pointer hover:text-gray-800 lg:hidden"
          @click="navStore.toggleNav()"
        />
        <div class="font-semibold text-lg">Vue 2 Playground</div>
      </div>
      <a
        class="text-indigo-600 hover:text-indigo-800"
        href="https://github.com/JensDll/validierung/tree/main"
        >GitHub</a
      >
    </div>
  </header>
</template>

<style lang="postcss" scoped></style>
