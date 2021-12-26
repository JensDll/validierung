<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  emits: ['click', 'submit'],
  props: {
    type: {
      type: String as PropType<'default' | 'primary' | 'danger'>,
      default: 'default'
    },
    htmlType: {
      type: String as PropType<'button' | 'submit' | 'reset'>,
      default: 'button'
    }
  }
})
</script>

<template>
  <button
    :type="htmlType"
    :class="[
      'py-1 px-4 rounded border-2  transition-colors',
      {
        default: 'border-gray-300 hover:bg-gray-100 ',
        primary:
          'bg-blue-600 border-blue-600 text-white hover:bg-blue-500 hover:border-blue-500',
        danger:
          'bg-red-500 border-red-500 text-white hover:bg-red-400 hover:border-red-400'
      }[type]
    ]"
    @click="$emit('click')"
  >
    <slot></slot>
  </button>
</template>
