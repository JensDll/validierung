<script setup lang="ts">
import type { PropType, UnwrapRef } from 'vue'
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
  <div class="container mx-auto">
    <section class="mb-12">
      <h1>{{ title }}</h1>
      <form autocomplete="off" @submit.prevent.self="$emit('submit')">
        <slot></slot>
      </form>
    </section>
    <section>
      <FormPreFormData :validation="validation" />
    </section>
  </div>
</template>

<style scoped></style>
