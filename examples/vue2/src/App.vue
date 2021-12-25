<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({})
</script>

<template>
  <div class="container py-12 px-8 mx-auto">
    <router-view></router-view>
  </div>
</template>

<style lang="postcss">
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>
