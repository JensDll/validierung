<script lang="ts">
import { defineComponent, PropType, UnwrapRef } from '@vue/composition-api'
import { UseValidation } from 'validierung'

import { stringify } from '~/domain'

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
      return stringify(this.val.form)
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
