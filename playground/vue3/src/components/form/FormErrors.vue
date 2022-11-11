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
  <ul v-show="errors.length" class="text-error mt-1 text-sm">
    <li v-for="error in errors" :key="error">{{ error }}</li>
  </ul>
</template>
