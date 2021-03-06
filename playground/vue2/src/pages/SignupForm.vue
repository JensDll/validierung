<script setup lang="ts">
import { useValidation, ValidationError, type Field } from 'validierung'

import { stringify, rules } from '~/domain'

type FormData = {
  name: Field<string>
  email: Field<string>
  password: Field<string>
  confirmPassword: Field<string>
}

const checkName = (name: string) => {
  if (!name) {
    return 'Please input your name'
  }
  return new Promise<void | string>(resolve => {
    setTimeout(() => {
      if (['alice', 'bob', 'oscar'].includes(name.toLocaleLowerCase())) {
        resolve()
      } else {
        resolve(
          `Name "${
            name.length < 30 ? name : `${name.slice(0, 31)}...`
          }" is not available`
        )
      }
    }, 700)
  })
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
    $rules: [['change', checkName, 500]]
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
    :title="$route.meta.title"
    :validation="{ form, validating, submitting, hasError, errors }"
    @submit="handleSubmit()"
  >
    <section class="space-y-2 xl:w-2/3">
      <div>
        <label for="name">Name</label>
        <div class="relative flex items-center">
          <input
            id="name"
            type="text"
            v-model="form.name.$value"
            placeholder="Alice, Bob, or Oscar"
          />
          <div
            class="i-custom-loading spin absolute right-3 h-5 w-5 animate-spin"
            v-show="form.name.$validating"
          />
        </div>
        <FormErrors :errors="form.name.$errors"></FormErrors>
      </div>
      <div>
        <label for="email">Email</label>
        <input id="email" type="email" v-model="form.email.$value" />
        <FormErrors :errors="form.email.$errors"></FormErrors>
      </div>
      <div>
        <label for="password">Password</label>
        <input id="password" type="password" v-model="form.password.$value" />
        <FormErrors :errors="form.password.$errors"></FormErrors>
      </div>
      <div>
        <label for="confirm-password">Confirm password</label>
        <input
          id="confirm-password"
          type="password"
          v-model="form.confirmPassword.$value"
        />
        <FormErrors :errors="form.confirmPassword.$errors"></FormErrors>
      </div>
      <div>
        <button class="mt-4" type="submit">Signup</button>
        <button type="button" class="ml-2" @click="resetFields()">Reset</button>
      </div>
    </section>
  </FormProvider>
</template>

<style scoped></style>
