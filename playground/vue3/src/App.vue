<script lang="ts">
import { defineComponent } from 'vue'

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
  }
})
</script>

<template>
  <div class="h-[100vh] grid grid-rows-[auto_1fr] gap-y-12">
    <TheNavBackground />
    <TheHeader />
    <div
      class="px-6 md:px-9 lg:px-12 lg:container lg:mx-auto lg:grid lg:grid-cols-[auto_1fr]"
    >
      <TheNav />
      <TheMain />
    </div>
  </div>
</template>

<style></style>
