<script lang="ts">
import { useValidation } from 'validierung'
import { defineComponent, ref, watch } from '@vue/composition-api'

export default defineComponent({
  setup() {
    const a = ref('')
    const useVal = useValidation({
      name: {
        $value: a,
        $rules: [
          [
            'change',
            (name: string) => {
              if (!name) {
                return 'Name'
              }
            }
          ]
        ]
      },
      a: {
        b: {
          cs: [
            {
              d: {
                $value: [],
                $rules: [
                  [
                    'change',
                    (x: any[]) => {
                      if (!x.length) {
                        return 'bla'
                      }
                    }
                  ]
                ]
              }
            }
          ]
        }
      }
    })
    console.log(useVal.form)
    async function handleSubmit() {
      try {
        const formData = await useVal.validateFields()
        console.log(JSON.stringify(formData, null, 2))
      } catch (e) {
        console.log(e)
      }
    }

    return { ...useVal, handleSubmit }
  }
})
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <div>
      <label>Name</label>
      <input
        type="text"
        v-model="form.name.$value"
        @blur="form.name.$validate()"
      />
    </div>
    <div>
      <select v-model="form.a.b.cs[0].d.$value" multiple>
        <option :value="value" v-for="value in ['a', 'b', 'c']" :key="value">
          {{ value }}
        </option>
      </select>
    </div>
    <button type="submit">Submit</button>
    <pre>{{ errors }}</pre>
    <pre>{{ form }}</pre>
  </form>
</template>

<style></style>
