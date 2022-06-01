<script setup lang="ts">
import type { PropType, UnwrapRef } from '@vue/composition-api'
import type { UseValidation } from 'validierung'

defineEmits(['submit'])
defineProps({
  title: {
    type: String,
    required: true
  },
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
</script>

<template>
  <div>
    <h1>{{ title }}</h1>
    <form autocomplete="off" @submit.prevent.self="$emit('submit')">
      <slot></slot>
    </form>
    <PreFormData class="mt-12" :validation="validation" />
  </div>
</template>

<style scoped></style>
