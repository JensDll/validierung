<script lang="ts">
import { PropType, defineComponent } from '@vue/composition-api'

export type IconName = 'Loading' | 'Menu' | 'MinusCircle' | 'PlusCircle'

const icons: Record<string, any> = import.meta.globEager('./icons/**/*.vue')

export default defineComponent({
  props: {
    icon: {
      type: String as PropType<IconName>,
      required: true
    }
  },
  setup() {
    return {
      icons
    }
  }
})
</script>

<template>
  <component :is="icons[`./icons/${icon}Icon.vue`].default" />
</template>
