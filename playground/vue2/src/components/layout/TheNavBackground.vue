<script lang="ts">
import { defineComponent } from '@vue/composition-api'

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
  <transition name="fade">
    <div
      v-if="!navStore.isHidden"
      class="fixed bg-black inset-0 z-40 bg-opacity-25 lg:hidden"
      @click="navStore.toggleNav()"
    ></div>
  </transition>
</template>

<style lang="postcss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
