<script lang="ts">
import { Field, useValidation } from 'validierung'
import { defineComponent } from '@vue/composition-api'

import { rules, stringify } from '~/domain'
import PreFormData from '~/components/form/PreFormData.vue'
import AppButton from '~/components/app/AppButton.vue'
import FormErrors from '~/components/form/FormErrors.vue'
import AppIcon from '~/components/app/AppIcon.vue'
import FormProvider from '~/components/form/FormProvider.vue'

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
    }, 300)
  })
}

export default defineComponent({
  components: {
    PreFormData,
    AppButton,
    FormErrors,
    AppIcon,
    FormProvider
  },
  setup() {
    const validation = useValidation<FormData>({
      name: {
        $value: '',
        $rules: [['change', checkName, 550]]
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
        const formData = await validation.validateFields()
        alert(stringify(formData))
      } catch {}
    }

    return {
      ...validation,
      handleSubmit
    }
  }
})
</script>

<template>
  <FormProvider
    title="Signup"
    :val="{ form, validating, submitting, errors, hasError }"
    @submit="handleSubmit()"
  >
    <div class="2xl:w-2/3">
      <div>
        <label class="label" for="name">Name</label>
        <div class="relative flex items-center">
          <input
            id="name"
            class="input w-full"
            :class="{ error: form.name.$hasError }"
            type="text"
            placeholder="Alice, Bob, or Oscar"
            v-model="form.name.$value"
          />
          <AppIcon
            icon="Loading"
            class="absolute right-3 h-5 w-5 text-indigo-500"
            :class="{ 'text-red-500': form.name.$hasError }"
            v-if="form.name.$validating"
          />
        </div>
        <FormErrors class="mt-1" :errors="form.name.$errors" />
      </div>
      <div class="mt-2">
        <label class="label" for="email">Email</label>
        <input
          id="email"
          class="input w-full"
          :class="{ error: form.email.$hasError }"
          type="text"
          v-model="form.email.$value"
          @blur="form.email.$validate()"
        />
        <FormErrors class="mt-1" :errors="form.email.$errors" />
      </div>
      <div class="mt-2">
        <label class="label" for="password">Password</label>
        <input
          id="password"
          class="input w-full"
          :class="{ error: form.password.$hasError }"
          type="password"
          v-model="form.password.$value"
          @blur="form.password.$validate()"
        />
        <FormErrors class="mt-1" :errors="form.password.$errors" />
      </div>
      <div class="mt-2">
        <label class="label" for="confirm-password">Confirm Password</label>
        <input
          id="confirm-password"
          class="input w-full"
          :class="{ error: form.confirmPassword.$hasError }"
          type="password"
          v-model="form.confirmPassword.$value"
          @blur="form.confirmPassword.$validate()"
        />
        <FormErrors class="mt-1" :errors="form.confirmPassword.$errors" />
      </div>
      <div class="mt-6 flex">
        <AppButton
          class="mr-4"
          type="submit"
          variant="primary"
          :disabled="submitting"
        >
          Signup
        </AppButton>
        <AppButton @click="resetFields()">Reset</AppButton>
      </div>
    </div>
  </FormProvider>
</template>

<style scoped></style>
