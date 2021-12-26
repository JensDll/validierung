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
      class="fixed bg-white inset-y-0 left-0 z-50 lg:relative"
    >
      <ul>
        <router-link
          v-for="route in routes"
          :key="route.name"
          :to="{ name: route.name }"
          custom
          v-slot="{ href, navigate, isActive, isExactActive }"
        >
          <li
            @click="navigate()"
            :class="[
              isActive && 'router-link-active',
              isExactActive && 'router-link-exact-active'
            ]"
          >
            {{ route.meta.displayName }}
          </li>
        </router-link>
      </ul>
    </nav>
  </transition>
  <transition name="fade">
    <div
      v-if="!navStore.isHidden"
      class="fixed bg-black inset-0 z-40 bg-opacity-25 lg:hidden"
      @click="navStore.toggleNav()"
    ></div>
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
