<script lang="ts">
import { useValidation } from 'compose-validation'
import { defineComponent } from 'vue3'

export default defineComponent({
  setup() {
    const { form } = useValidation({
      name: {
        $value: '',
        $rules: [
          [
            'change',
            (name: string) => {
              console.log(name)
            }
          ]
        ]
      }
    })

    console.log(form.name)

    return { form }
  }
})
</script>

<template>
  <form>
    <div>
      <label>Name</label>
      <input
        type="text"
        v-model="form.name.$value"
        @blur="form.name.$validate()"
      />
    </div>
  </form>
</template>

<style></style>
