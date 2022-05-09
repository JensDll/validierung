<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api'

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
  <ul v-show="errors.length" class="text-sm text-red-500">
    <li v-for="error in errors" :key="error">{{ error }}</li>
  </ul>
</template>

<style lang="postcss" scoped></style>
