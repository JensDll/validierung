<script lang="ts">
import { defineComponent } from 'vue'
import { Field, useValidation } from 'validierung'

import AppButton from '~/components/app/AppButton.vue'
import FormProvider from '~/components/form/FormProvider.vue'
import FormErrors from '~/components/form/FormErrors.vue'
import FormFileUpload from '~/components/form/FormFileUpload.vue'
import { rules } from '~/domain'

type FormData = {
  zip: Field<string>
  files: Field<File[]>
}

export default defineComponent({
  components: {
    AppButton,
    FormProvider,
    FormErrors,
    FormFileUpload
  },
  setup() {
    const val = useValidation<FormData>({
      zip: {
        $value: '',
        $rules: [
          ['submit', rules.min(3)('The name has to be 3 characters or longer')]
        ]
      },
      files: {
        $value: [],
        $rules: [['submit', rules.min(1)('Please select one or more files')]]
      }
    })

    async function handleSubmit() {
      try {
        const formData = await val.validateFields()
        console.log(formData)
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
    title="File Upload"
    :val="{ form, validating, submitting, errors, hasError }"
    @submit="handleSubmit()"
  >
    <div class="2xl:w-2/3">
      <div>
        <label class="label" for="zip-name">ZIP Name</label>
        <input
          id="zip-name"
          class="input"
          :class="{ error: form.zip.$hasError }"
          type="text"
          v-model="form.zip.$value"
          @blur="form.zip.$validate()"
        />
        <FormErrors class="mt-1" :errors="form.zip.$errors" />
      </div>
      <FormFileUpload
        class="mt-3"
        label="Files to Upload"
        multiple
        :errors="form.files.$errors"
        v-model="form.files.$value"
      />
      <div class="mt-6">
        <AppButton
          class="mr-3"
          html-type="submit"
          type="primary"
          :disabled="submitting"
        >
          Upload
        </AppButton>
        <AppButton @click="resetFields()">Reset</AppButton>
      </div>
    </div>
  </FormProvider>
</template>

<style lang="postcss" scoped></style>
