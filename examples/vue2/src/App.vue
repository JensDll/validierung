<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({})
</script>

<template>
  <div class="container py-12 px-8">
    <router-view></router-view>
  </div>
</template>

<style lang="postcss">
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  display: grid;
  height: 100vh;
  justify-items: center;
}
</style>
