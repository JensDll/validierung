<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  props: {
    errors: {
      type: Array as PropType<string[]>,
      required: true
    }
  }
})
</script>

<template>
  <ul v-show="errors.length" class="text-red-500 text-sm">
    <li v-for="error in errors" :key="error">{{ error }}</li>
  </ul>
</template>

<style lang="postcss" scoped></style>
