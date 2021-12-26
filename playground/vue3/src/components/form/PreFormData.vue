<script lang="ts">
import { defineComponent, PropType, UnwrapRef } from 'vue'
import { UseValidation } from 'validierung'

export default defineComponent({
  props: {
    val: {
      type: Object as PropType<
        UnwrapRef<
          Pick<
            UseValidation<object>,
            'form' | 'validating' | 'submitting' | 'hasError' | 'errors'
          >
        >
      >,
      required: true
    }
  },
  computed: {
    formJson(): string {
      return JSON.stringify(
        this.val.form,
        (key, value) => {
          if (value === undefined) {
            return 'undefined'
          }
          if (typeof value === 'function') {
            return 'function'
          }
          if (value instanceof File) {
            return `File { name: ${value.name} }`
          }
          return value
        },
        2
      )
    }
  }
})
</script>

<template>
  <div>
    <h2>Validation State</h2>
    <pre>Validating: {{ val.validating }}</pre>
    <pre class="mt-1">Submitting: {{ val.submitting }}</pre>
    <pre class="mt-1">Has Error: {{ val.hasError }}</pre>
    <pre class="mt-1">Errors: {{ val.errors }}</pre>
    <pre class="mt-1">Form: {{ formJson }}</pre>
  </div>
</template>

<style lang="postcss" scoped></style>
