<script lang="ts">
import { defineComponent } from 'vue'

import { useNavStore } from './modules/pinia'
import TheNav from './components/layout/TheNav.vue'
import TheNavBackground from './components/layout/TheNavBackground.vue'
import TheHeader from './components/layout/TheHeader.vue'
import TheMain from './components/layout/TheMain.vue'

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
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply font-sans;
  }

  h1 {
    @apply text-3xl font-bold mb-[1em];
  }

  h2 {
    @apply text-2xl font-semibold mb-[0.8em];
  }

  pre {
    white-space: pre-wrap;
  }
}

@layer components {
  .label {
    @apply block mb-1 font-medium text-gray-700;
  }

  .input {
    @apply block py-2 px-3 rounded-md border border-gray-300 shadow-sm;
  }

  .input:focus,
  .input:focus-within {
    @apply border-indigo-300 ring ring-indigo-200 ring-opacity-50;
  }

  .input.error {
    @apply border-red-400;
  }

  .input.error:focus,
  .input.error:focus-within {
    @apply border-red-300 ring ring-red-200 ring-opacity-50;
  }
}
</style>
