<script setup lang="ts">
import type { PropType } from 'vue'

defineProps({
  errors: {
    type: Array as PropType<string[]>,
    required: true
  }
})
</script>

<template>
  <ul
    v-show="errors.length"
    class="text-text-error !mb-0 !mt-1 list-none !p-0 text-sm"
  >
    <li class="!m-0 !p-0" v-for="error in errors" :key="error">{{ error }}</li>
  </ul>
</template>

<style scoped></style>
