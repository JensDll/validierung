<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api'

export default defineComponent({
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
    class="block px-14 py-6"
    :class="[
      { default: '', primary: 'bg-indigo-500 text-white', danger: '' }[type]
    ]"
  >
    <slot></slot>
  </button>
</template>
