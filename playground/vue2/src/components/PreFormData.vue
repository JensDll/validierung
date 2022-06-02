<script setup lang="ts">
import { type PropType, type UnwrapRef, computed } from '@vue/composition-api'
import type { UseValidation } from 'validierung'

import { stringify } from '~/domain'

const props = defineProps({
  validation: {
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
})

const formJson = computed(() => {
  return stringify(props.validation.form)
})
</script>

<template>
  <div>
    <h2>Validation State</h2>
    <pre>Validating: {{ validation.validating }}</pre>
    <pre class="mt-1">Submitting: {{ validation.submitting }}</pre>
    <pre class="mt-1">Has Error: {{ validation.hasError }}</pre>
    <pre class="mt-1">Errors: {{ validation.errors }}</pre>
    <pre class="mt-1">Form: {{ formJson }}</pre>
  </div>
</template>

<style scoped></style>
