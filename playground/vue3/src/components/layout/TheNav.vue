<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

import { useNavStore } from '~/modules/pinia'

export default defineComponent({
  setup() {
    const navStore = useNavStore()
    const router = useRouter()
    const routes = router.getRoutes()

    return {
      navStore,
      routes
    }
  }
})
</script>

<template>
  <transition name="slide">
    <nav
      v-if="!navStore.isHidden"
      class="p-4 fixed bg-white inset-y-0 left-0 z-50 border-r lg:p-0 lg:pr-8 lg:relative"
    >
      <ul class="space-y-2 lg:sticky lg:top-6">
        <router-link
          v-for="route in routes"
          :key="route.name"
          :to="{ name: route.name }"
          custom
          v-slot="{ navigate, isActive, isExactActive }"
        >
          <li
            :class="[
              'pl-4 pr-12 py-2 rounded-md cursor-pointer hover:text-sky-500 lg:ml-[-1rem]',
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
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
