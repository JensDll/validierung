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
  <Transition name="slide">
    <nav
      v-show="!navStore.isHidden"
      class="fixed inset-y-0 left-0 z-50 border-r bg-white p-4 lg:relative lg:!block lg:p-0 lg:pr-8"
    >
      <ul class="space-y-2 lg:sticky lg:top-6">
        <router-link
          v-for="route in $router.getRoutes()"
          :key="route.name"
          :to="{ name: route.name }"
          custom
          v-slot="{ navigate, isActive, isExactActive }"
        >
          <li
            :class="[
              'cursor-pointer whitespace-nowrap rounded-md py-2 pl-4 pr-10 hover:text-emerald-600 lg:ml-[-1rem]',
              isActive && 'router-link-active',
              isExactActive && 'bg-emerald-50 font-medium text-emerald-600'
            ]"
            @click="navigate"
          >
            {{ route.meta.displayName }}
          </li>
        </router-link>
      </ul>
    </nav>
  </Transition>
</template>

<style lang="postcss" scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.2s;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
