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
  <transition name="slide">
    <nav
      v-if="!navStore.isHidden"
      class="pr-8 pb-24 fixed bg-white inset-y-0 left-0 z-50 border-r lg:relative"
    >
      <ul class="space-y-2 lg:sticky lg:top-8">
        <router-link
          v-for="route in $router.getRoutes()"
          :key="route.name"
          :to="{ name: route.name }"
          custom
          v-slot="{ navigate, isActive, isExactActive }"
        >
          <li
            :class="[
              'pl-4 pr-12 py-2 rounded-md cursor-pointer hover:text-sky-500',
              isActive && 'router-link-active',
              isExactActive && 'bg-sky-50 text-sky-500 font-medium'
            ]"
            @click="navigate"
          >
            {{ route.meta.displayName }}
          </li>
        </router-link>
      </ul>
    </nav>
  </transition>
</template>

<style lang="postcss" scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.2s;
}
.slide-enter,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
