<script lang="ts">
import { Field, useValidation } from 'validierung'
import { defineComponent } from 'vue'

import PreFormData from '~/components/form/PreFormData.vue'
import AppButton from '~/components/app/AppButton.vue'
import FormErrors from '~/components/form/FormErrors.vue'
import { rules } from '~/domain'
import LoadingIcon from '~/components/icon/LoadingIcon.vue'
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
    LoadingIcon,
    FormProvider
  },
  setup() {
    const val = useValidation<FormData>({
      name: {
        $value: '',
        $rules: [['change', checkName, 550]]
      },
      email: {
        $value: '',
        $rules: [
          rules.email(
            `Please use a valid email address containing an "@" followed by a "."`
          )
        ]
      },
      password: {
        $value: '',
        $rules: [
          rules.min(8)('Please use a password longer than 7 characters'),
          {
            key: 'pw',
            rule: rules.equal('Passwords do not match')
          }
        ]
      },
      confirmPassword: {
        $value: '',
        $rules: [
          rules.min(8)('Please use a password longer than 7 characters'),
          {
            key: 'pw',
            rule: rules.equal('Passwords do not match')
          }
        ]
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
  <FormProvider
    title="Signup Form"
    :val="{ form, validating, submitting, errors, hasError }"
    @submit="handleSubmit()"
  >
    <div class="2xl:w-2/3">
      <div>
        <label class="block font-medium mb-1" for="name">Name</label>
        <div class="flex items-center relative">
          <input
            class="w-full rounded border-2 p-1"
            id="name"
            type="text"
            placeholder="Alice, Bob, or Oscar"
            v-model="form.name.$value"
          />
          <LoadingIcon
            class="w-4 h-4 text-blue-600 absolute right-2"
            v-if="form.name.$validating"
          />
        </div>
        <FormErrors class="mt-1" :errors="form.name.$errors" />
      </div>
      <div class="mt-2">
        <label class="block font-medium mb-1" for="email">Email</label>
        <input
          class="w-full rounded border-2 p-1"
          id="email"
          type="text"
          v-model="form.email.$value"
          @blur="form.email.$validate()"
        />
        <FormErrors class="mt-1" :errors="form.email.$errors" />
      </div>
      <div class="grid grid-cols-2 gap-x-4 mt-2">
        <div>
          <label class="block font-medium mb-1" for="password">Password</label>
          <input
            class="w-full rounded border-2 p-1"
            id="password"
            type="password"
            v-model="form.password.$value"
            @blur="form.password.$validate()"
          />
          <FormErrors class="mt-1" :errors="form.password.$errors" />
        </div>
        <div>
          <label class="block font-semibold mb-1" for="confirm-password">
            Confirm
          </label>
          <input
            class="w-full rounded border-2 p-1"
            id="confirm-password"
            type="password"
            v-model="form.confirmPassword.$value"
            @blur="form.confirmPassword.$validate()"
          />
          <FormErrors class="mt-1" :errors="form.confirmPassword.$errors" />
        </div>
      </div>
      <div class="mt-6">
        <AppButton
          class="mr-2"
          html-type="submit"
          type="primary"
          :disabled="submitting"
        >
          Signup
        </AppButton>
        <AppButton @click="resetFields()">Reset</AppButton>
      </div>
    </div>
  </FormProvider>
</template>

<style lang="postcss" scoped></style>
