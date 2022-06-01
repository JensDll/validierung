<script setup lang="ts">
import { useValidation, ValidationError, type Field } from 'validierung'

import { stringify, rules } from '~/domain'

type FormData = {
  name: Field<string>
  email: Field<string>
  password: Field<string>
  confirmPassword: Field<string>
}

const {
  form,
  validating,
  submitting,
  hasError,
  errors,
  validateFields,
  resetFields
} = useValidation<FormData>({
  name: {
    $value: '',
    $rules: [rules.required('Name is required')]
  },
  email: {
    $value: '',
    $rules: [rules.email('Please use a valid email address')]
  },
  password: {
    $value: '',
    $rules: [
      rules.min(8)('Password has to be longer than 8 characters'),
      [
        'lazy',
        {
          key: 'pw',
          rule: rules.equal('Passwords do not match')
        }
      ]
    ]
  },
  confirmPassword: {
    $value: '',
    $rules: [
      rules.min(8)('Password has to be longer than 8 characters'),
      [
        'lazy',
        {
          key: 'pw',
          rule: rules.equal('Passwords do not match')
        }
      ]
    ]
  }
})

async function handleSubmit() {
  try {
    const formData = await validateFields()
    alert(stringify(formData))
  } catch (e) {
    if (e instanceof ValidationError) {
      console.log(e.message)
    }
  }
}
</script>

<template>
  <FormProvider
    class="container"
    title="Signup"
    :validation="{ form, validating, submitting, hasError, errors }"
    @submit="handleSubmit()"
  >
    <div>
      <label class="block" for="name">Name</label>
      <input id="name" type="text" v-model="form.name.$value" />
      <FormErrors :errors="form.name.$errors"></FormErrors>
    </div>
    <div>
      <label class="block" for="email">Email</label>
      <input id="email" type="email" v-model="form.email.$value" />
      <FormErrors :errors="form.email.$errors"></FormErrors>
    </div>
    <div>
      <label class="block" for="password">Password</label>
      <input id="password" type="password" v-model="form.password.$value" />
      <FormErrors :errors="form.password.$errors"></FormErrors>
    </div>
    <div>
      <label class="block" for="confirm-password">Confirm password</label>
      <input
        id="confirm-password"
        type="password"
        v-model="form.confirmPassword.$value"
      />
      <FormErrors :errors="form.confirmPassword.$errors"></FormErrors>
    </div>
    <div class="mt-4">
      <button type="submit">Signup</button>
      <button type="button" class="ml-2" @click="resetFields()">Reset</button>
    </div>
  </FormProvider>
</template>

<style scoped></style>
