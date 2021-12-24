<script lang="ts">
import { Field, useValidation } from 'validierung'
import { defineComponent, ref } from 'vue'

import PreFormData from '~/components/form/PreFormData.vue'
import AppButton from '~/components/app/AppButton.vue'

type FormData = {
  name: Field<string>
  email: Field<string>
  password: Field<string>
  confirmPassword: Field<string>
}

export default defineComponent({
  components: {
    PreFormData,
    AppButton
  },
  setup() {
    const val = useValidation<FormData>({
      name: {
        $value: '',
        $rules: [['change', name => {}]]
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

    async function handleSubmit() {
      try {
        const formData = await val.validateFields()
        console.log(JSON.stringify(formData, null, 2))
      } catch {}
    }

    return {
      ...val,
      handleSubmit
    }
  }
})
</script>

<template>
  <div>
    <form @submit.prevent="handleSubmit">
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
    <AppButton html-type="submit" type="primary">Submit</AppButton>
    <PreFormData :val="{ form, validating, submitting, errors, hasError }" />
  </div>
</template>

<style></style>
