<script lang="ts">
import { Field, useValidation } from 'validierung'
import { defineComponent } from 'vue'

import PreFormData from '~/components/form/PreFormData.vue'
import AppButton from '~/components/app/AppButton.vue'
import FormErrors from '~/components/form/FormErrors.vue'
import { rules } from '~/domain'
import LoadingIcon from '~/components/icon/LoadingIcon.vue'

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
    LoadingIcon
  },
  setup() {
    const val = useValidation<FormData>({
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
          rules.min(8)('Password has to be 8 characters or longer'),
          {
            key: 'pw',
            rule: rules.equal('Passwords do not match')
          }
        ]
      },
      confirmPassword: {
        $value: '',
        $rules: [
          rules.min(8)('Password has to be 8 characters or longer'),
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
  <div class="mx-auto max-w-2xl">
    <form class="form" autocomplete="off" @submit.prevent="handleSubmit">
      <div>
        <label class="block font-medium" for="name">Name</label>
        <div class="flex items-center relative">
          <input
            class="w-full rounded border-2 px-1 py-[1px]"
            id="name"
            type="text"
            v-model="form.name.$value"
          />
          <LoadingIcon
            class="w-4 h-4 text-blue-600 absolute right-2"
            v-if="form.name.$validating"
          />
        </div>
        <FormErrors :errors="form.name.$errors" />
      </div>
      <div class="mt-2">
        <label class="block font-medium" for="email">Email</label>
        <input
          class="w-full rounded border-2 px-1 py-[1px]"
          id="email"
          type="text"
          v-model="form.email.$value"
          @blur="form.email.$validate()"
        />
        <FormErrors :errors="form.email.$errors" />
      </div>
      <div class="mt-2">
        <label class="block font-medium" for="password">Password</label>
        <input
          class="w-full rounded border-2 px-1 py-[1px]"
          id="password"
          type="password"
          v-model="form.password.$value"
          @blur="form.password.$validate()"
        />
        <FormErrors :errors="form.password.$errors" />
      </div>
      <div class="mt-2">
        <label class="block font-semibold" for="confirm-password">
          Confirm Password
        </label>
        <input
          class="w-full rounded border-2 px-1 py-[1px]"
          id="confirm-password"
          type="password"
          v-model="form.confirmPassword.$value"
          @blur="form.confirmPassword.$validate()"
        />
        <FormErrors :errors="form.confirmPassword.$errors" />
      </div>
      <div class="mt-6">
        <AppButton
          class="mr-2"
          html-type="submit"
          type="primary"
          :disabled="submitting"
        >
          Submit
        </AppButton>
        <AppButton html-type="button" @click="resetFields()">Reset</AppButton>
      </div>
    </form>
    <PreFormData :val="{ form, validating, submitting, errors, hasError }" />
  </div>
</template>

<style lang="postcss" scoped></style>
