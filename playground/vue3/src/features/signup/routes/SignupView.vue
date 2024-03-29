<script setup lang="ts">
import { useValidation, ValidationError, type Field } from 'validierung'
import { useRoute } from 'vue-router'

import { stringify } from '~/common/stringify'
import { email, equal, min } from '~/common/rules'

type FormData = {
  name: Field<string>
  email: Field<string>
  password: Field<string>
  confirmPassword: Field<string>
}

const route = useRoute()

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
    $rules: [email('Please use a valid email address')]
  },
  password: {
    $value: '',
    $rules: [
      min(8)('Password has to be longer than 8 characters'),
      [
        'lazy',
        {
          key: 'pw',
          rule: equal('Passwords do not match')
        }
      ]
    ]
  },
  confirmPassword: {
    $value: '',
    $rules: [
      min(8)('Password has to be longer than 8 characters'),
      [
        'lazy',
        {
          key: 'pw',
          rule: equal('Passwords do not match')
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
    :title="route.meta.title"
    :validation="{ form, validating, submitting, hasError, errors }"
    @submit="handleSubmit()"
  >
    <section class="space-y-2">
      <div>
        <label for="name">Name</label>
        <div
          class="relative flex items-center"
          :class="{ error: form.name.$hasError }"
        >
          <input
            id="name"
            type="text"
            v-model="form.name.$value"
            placeholder="Alice, Bob, or Oscar"
          />
          <div
            class="i-custom-loading text-border-form-highlight firefox-border-animation-fix absolute right-3"
            v-show="form.name.$validating"
          ></div>
        </div>
        <FormErrors :errors="form.name.$errors"></FormErrors>
      </div>
      <div :class="{ error: form.email.$hasError }">
        <label for="email">Email</label>
        <input
          id="email"
          type="email"
          v-model="form.email.$value"
          @blur="form.email.$validate()"
        />
        <FormErrors :errors="form.email.$errors"></FormErrors>
      </div>
      <div :class="{ error: form.password.$hasError }">
        <label for="password">Password</label>
        <input
          id="password"
          type="password"
          v-model="form.password.$value"
          @blur="form.password.$validate()"
        />
        <FormErrors :errors="form.password.$errors"></FormErrors>
      </div>
      <div :class="{ error: form.confirmPassword.$hasError }">
        <label for="confirm-password">Confirm password</label>
        <input
          id="confirm-password"
          type="password"
          v-model="form.confirmPassword.$value"
          @blur="form.confirmPassword.$validate()"
        />
        <FormErrors :errors="form.confirmPassword.$errors"></FormErrors>
      </div>
    </section>
    <div>
      <button class="mt-10" type="submit">Signup</button>
      <button type="button" class="ml-3" @click="resetFields()">Reset</button>
    </div>
  </FormProvider>
</template>

<style scoped></style>
