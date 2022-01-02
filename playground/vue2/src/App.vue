<script lang="ts">
import { defineComponent } from '@vue/composition-api'

import { useNavStore } from './modules/pinia'
import TheNav from './components/layout/TheNav.vue'
import TheHeader from './components/layout/TheHeader.vue'
import TheMain from './components/layout/TheMain.vue'
import TheNavBackground from './components/layout/TheNavBackground.vue'

export default defineComponent({
  components: {
    TheNav,
    TheHeader,
    TheMain,
    TheNavBackground
  },
  setup() {
    const navStore = useNavStore()
    const mobileBreakPoint = 1024

    if (window.innerWidth >= mobileBreakPoint) {
      navStore.isHidden = false
    }

    let prevInnerWidth = 0

    window.addEventListener('resize', () => {
      if (
        prevInnerWidth <= mobileBreakPoint &&
        window.innerWidth >= mobileBreakPoint
      ) {
        navStore.isHidden = false
      }

      prevInnerWidth = window.innerWidth
    })

    return {
      navStore
    }
  }
})
</script>

<template>
  <div class="h-[100vh] grid grid-rows-[auto_1fr] gap-y-12">
    <TheNavBackground />
    <TheHeader />
    <div
      class="px-6 lg:px-12 lg:container lg:mx-auto lg:grid lg:grid-cols-[auto_1fr]"
    >
      <TheNav />
      <TheMain />
    </div>
  </div>
</template>

<style lang="postcss">
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  h1 {
    @apply text-3xl font-bold mb-[1em];
  }

  h2 {
    @apply text-2xl font-semibold mb-[0.8em];
  }
}

@layer components {
  .label {
    @apply block mb-1 font-medium text-gray-700;
  }

  .input {
    @apply block py-2 px-3 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50;
  }

  .input.error {
    @apply border-red-400 focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50;
  }
}
</style>
