<script lang="ts">
import { defineComponent, PropType, UnwrapRef } from '@vue/composition-api'
import { UseValidation } from 'validierung'

import PreFormData from './PreFormData.vue'

export default defineComponent({
  components: {
    PreFormData
  },
  props: {
    title: {
      type: String,
      required: true
    },
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
    },
    formClass: {
      type: String
    }
  }
})
</script>

<template>
  <div>
    <h1>{{ title }}</h1>
    <form
      :class="formClass"
      autocomplete="off"
      @submit.prevent.self="$emit('submit')"
    >
      <slot></slot>
    </form>
    <PreFormData class="mt-12" :val="val" />
  </div>
</template>

<style lang="postcss" scoped></style>
