<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({})
</script>

<template>
  <svg
    class="w-6 h-6 cursor-pointer text-red-600 hover:text-red-700"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    @click="$emit('click')"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
</template>

<style lang="postcss" scoped></style>
