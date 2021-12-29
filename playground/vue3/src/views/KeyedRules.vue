<script lang="ts">
import { defineComponent } from 'vue'
import { useValidation, Field } from 'validierung'

import { compare, rules } from '~/domain'
import FormProvider from '~/components/form/FormProvider.vue'
import AppButton from '~/components/app/AppButton.vue'
import FormErrors from '~/components/form/FormErrors.vue'

type FormData = {
  startDate: Field<string>
  startTime: Field<string>
  endDate: Field<string>
  endTime: Field<string>
}

export default defineComponent({
  components: { FormProvider, AppButton, FormErrors },
  setup() {
    const val = useValidation<FormData>({
      startDate: {
        $value: '',
        $rules: [
          rules.required('Please select a date'),
          rules.inTheFuture('Please select a date in the future'),
          { key: 'date-and-time' }
        ]
      },
      startTime: {
        $value: '',
        $rules: [
          rules.required('Please select a time'),
          { key: 'date-and-time' }
        ]
      },
      endDate: {
        $value: '',
        $rules: [
          rules.required('Please select a date'),
          [
            'change',
            {
              key: 'date-and-time',
              rule(
                startDate: string,
                startTime: string,
                endDate: string,
                endTime: string
              ) {
                if (!startDate || !endDate || !startTime || !endTime) {
                  return
                }

                if (compare.date(startDate, endDate) > 0) {
                  return 'Please select a combination in the future'
                }
              }
            }
          ]
        ]
      },
      endTime: {
        $value: '',
        $rules: [
          rules.required('Please select a time'),
          [
            'change',
            {
              key: 'date-and-time',
              rule(
                startDate: string,
                startTime: string,
                endDate: string,
                endTime: string
              ) {
                if (!startDate || !endDate || !startTime || !endTime) {
                  return
                }

                if (
                  compare.date(startDate, endDate) === 0 &&
                  compare.time(startTime, endTime) > 0
                ) {
                  return 'Please select a combination in the future'
                }
              }
            }
          ]
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
    title="Keyed Rules"
    :val="{ form, validating, submitting, errors, hasError }"
    @submit="handleSubmit()"
  >
    <div class="flex">
      <div>
        <label class="block font-medium mb-1" for="start-date">Starts</label>
        <input
          id="start-date"
          class="border-2 p-1 rounded-md"
          :class="{ 'bg-red-50 border-red-200': form.startDate.$hasError }"
          type="date"
          v-model="form.startDate.$value"
          @blur="form.startDate.$validate()"
        />
        <input
          id="start-time"
          class="ml-2 border-2 p-1 rounded-md"
          :class="{ 'bg-red-50 border-red-200': form.startTime.$hasError }"
          type="time"
          v-model="form.startTime.$value"
          @blur="form.startTime.$validate()"
        />
        <FormErrors
          class="mt-1"
          :errors="[...form.startDate.$errors, ...form.startTime.$errors]"
        />
      </div>
      <span class="mt-[33px] mx-4">-</span>
      <div>
        <label class="block font-medium mb-1" for="end-date">Ends By</label>
        <input
          id="end-date"
          class="border-2 p-1 rounded-md"
          :class="{ 'bg-red-50 border-red-200': form.endDate.$hasError }"
          type="date"
          v-model="form.endDate.$value"
          @blur="form.endDate.$validate()"
        />
        <input
          id="end-time"
          class="ml-2 border-2 p-1 rounded-md"
          :class="{ 'bg-red-50 border-red-200': form.endTime.$hasError }"
          type="time"
          v-model="form.endTime.$value"
          @blur="form.endTime.$validate()"
        />
        <FormErrors
          class="mt-1"
          :errors="[...form.endDate.$errors, ...form.endTime.$errors]"
        />
      </div>
    </div>
    <div class="mt-8">
      <AppButton
        class="mr-2"
        html-type="submit"
        type="primary"
        :disabled="submitting"
      >
        Submit
      </AppButton>
      <AppButton @click="resetFields()">Reset</AppButton>
    </div>
  </FormProvider>
</template>

<style lang="postcss" scoped></style>
