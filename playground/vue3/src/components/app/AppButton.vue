<script lang="ts">
import { defineComponent, ref, onMounted, Ref, PropType } from 'vue'

import { guards } from '~/domain'

export default defineComponent({
  emits: ['click'],
  props: {
    type: {
      type: String as PropType<'default' | 'primary' | 'danger'>,
      default: 'default'
    },
    htmlType: {
      type: String as PropType<'button' | 'submit' | 'reset'>,
      default: 'button'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const button = ref() as Ref<HTMLButtonElement>
    let form: HTMLFormElement | null = null

    onMounted(() => {
      if (props.htmlType !== 'submit') {
        return
      }

      for (
        let el: HTMLElement | null = button.value;
        el;
        el = el.parentElement
      ) {
        if (guards.isFormElement(el)) {
          form = el
        }
      }
    })

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLButtonElement

      if (!target.disabled && target.ariaDisabled !== 'true') {
        emit('click')
      }
    }

    const handleSubmit = (e: MouseEvent) => {
      e.preventDefault()
      const target = e.target as HTMLButtonElement

      if (!target.disabled && target.ariaDisabled !== 'true' && form) {
        form.dispatchEvent(
          new SubmitEvent('submit', { submitter: button.value })
        )
      }
    }

    return {
      eventListeners: {
        click: props.htmlType === 'submit' ? handleSubmit : handleClick
      },
      button
    }
  }
})
</script>

<template>
  <button
    :type="htmlType"
    :class="[
      'py-1 px-4 rounded border-2 font-medium transition-colors ring-offset-2 focus:ring-2 focus:outline-none',
      {
        default: 'border-gray-300 hover:bg-gray-100 focus:ring-gray-300',
        primary:
          'bg-indigo-600 border-indigo-600 text-white hover:bg-indigo-500 hover:border-indigo-500 focus:ring-indigo-600',
        danger:
          'bg-red-500 border-red-500 text-white hover:bg-red-400 hover:border-red-400'
      }[type]
    ]"
    :aria-disabled="disabled"
    ref="button"
    v-on="eventListeners"
  >
    <slot></slot>
  </button>
</template>
