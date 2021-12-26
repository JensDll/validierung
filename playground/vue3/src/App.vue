<script lang="ts">
import { defineComponent } from 'vue'

import { useNavStore } from './modules/pinia'
import TheNav from './components/layout/TheNav.vue'
import TheHeader from './components/layout/TheHeader.vue'
import TheMain from './components/layout/TheMain.vue'

export default defineComponent({
  components: {
    TheNav,
    TheHeader,
    TheMain
  },
  setup() {
    const navStore = useNavStore()

    if (window.innerWidth >= 1024) {
      navStore.isHidden = false
    }

    let prevInnerWidth = 0
    window.addEventListener('resize', () => {
      if (prevInnerWidth <= 1024 && window.innerWidth >= 1024) {
        navStore.isHidden = false
      }
      prevInnerWidth = window.innerWidth
    })
  }
})
</script>

<template>
  <div class="px-6 lg:px-12">
    <TheHeader />
    <div class="mt-12 lg:container lg:mx-auto lg:grid lg:grid-cols-[auto_1fr]">
      <TheNav />
      <TheMain />
    </div>
  </div>
</template>

<style lang="postcss">
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>
