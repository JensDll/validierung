<script lang="ts">
import { Field, useValidation } from 'validierung'
import { defineComponent, ref, watch } from 'vue'

type FormData = {
  name: Field<string>
  email: Field<string>
  password: Field<string>
  confirmPassword: Field<string>
}

export default defineComponent({
  setup() {
    const { form } = useValidation<FormData>({
      name: {
        $value: ''
      },
      email: {
        $value: ''
      },
      password: {
        $value: ''
      },
      confirmPassword: {
        $value: ''
      }
    })

    console.log(form)

    return {
      form
    }
  }
})
</script>

<template>
  <form action="">
    <label>
      Name
      <input type="text" v-model="form.name.$value" />
    </label>
    <label>
      Email
      <input type="text" v-model="form.email.$value" />
    </label>
    <label>
      Password
      <input type="text" v-model="form.password.$value" />
    </label>
    <label>
      Confirm
      <input type="text" v-model="form.confirmPassword.$value" />
    </label>
  </form>
</template>

<style></style>
