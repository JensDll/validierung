<script lang="ts">
import { PropType, defineComponent } from 'vue'

export default defineComponent({
  emits: ['click'],
  props: {
    variant: {
      type: String as PropType<'default' | 'primary'>,
      default: 'default'
    },
    type: {
      type: String as PropType<'button' | 'submit' | 'reset'>,
      default: 'button'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleClick(e: MouseEvent) {
      const target = e.target as HTMLButtonElement
      if (!target.disabled && target.ariaDisabled !== 'true') {
        this.$emit('click')
      }
    }
  }
})
</script>

<template>
  <div class="group relative">
    <button
      :type="type"
      :class="[
        'relative block rounded border-2 py-1 px-4 font-medium outline-offset-[2.5px] focus:outline focus:outline-2',
        {
          default: `border-gray-300 hover:bg-gray-100 focus:outline-gray-300`,
          primary: `border-indigo-500 bg-indigo-500 text-white hover:border-indigo-400 hover:bg-indigo-400 focus:outline-indigo-400
          dark:border-indigo-600 dark:bg-indigo-600 dark:hover:border-indigo-500 dark:hover:bg-indigo-500 dark:focus:outline-indigo-500`
        }[variant],
        {
          'cursor-not-allowed opacity-30': disabled
        }
      ]"
      :disabled="disabled"
      @click="handleClick"
    >
      <slot></slot>
    </button>
  </div>
</template>
