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

const requiredDate = (date: string, time: string) => {
  if (!date && !time) {
    return Symbol()
  }

  if (!date) {
    return 'Select a date'
  }
}

const requiredTime = (date: string, time: string) => {
  if (!date && !time) {
    return 'Select a date and time'
  }

  if (!time) {
    return 'Select a time'
  }
}

export default defineComponent({
  components: { FormProvider, AppButton, FormErrors },
  setup() {
    const val = useValidation<FormData>({
      startDate: {
        $value: '',
        $rules: [
          ['change', rules.inTheFuture('Select a date in the future')],
          { key: 'start', rule: requiredDate },
          { key: 'date-and-time' }
        ]
      },
      startTime: {
        $value: '',
        $rules: [{ key: 'start', rule: requiredTime }, { key: 'date-and-time' }]
      },
      endDate: {
        $value: '',
        $rules: [
          { key: 'end', rule: requiredDate },
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
                return 'Select a later combination'
              }
            }
          }
        ]
      },
      endTime: {
        $value: '',
        $rules: [
          { key: 'end', rule: requiredTime },
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
                return 'Select a later combination'
              }
            }
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
    title="Keyed Rules"
    :val="{ form, validating, submitting, errors, hasError }"
    @submit="handleSubmit()"
  >
    <div class="flex flex-col md:flex-row">
      <div>
        <label class="label" for="start-date">Starts</label>
        <div class="flex">
          <input
            id="start-date"
            class="input rounded-r-none focus:z-10"
            :class="{
              'error z-10': form.startDate.$hasError
            }"
            type="date"
            :min="new Date().toLocaleDateString('en-CA')"
            v-model="form.startDate.$value"
            @blur="form.startDate.$validate()"
          />
          <input
            id="start-time"
            class="input rounded-l-none ml-[-1px] focus:z-10"
            :class="{ error: form.startTime.$hasError }"
            type="time"
            v-model="form.startTime.$value"
            @blur="form.startTime.$validate()"
          />
        </div>
        <FormErrors
          class="mt-1"
          :errors="[...form.startDate.$errors, ...form.startTime.$errors]"
        />
      </div>
      <div class="hidden md:block mt-[33px] mx-4">-</div>
      <div class="mt-4 md:mt-0">
        <label class="label" for="end-date">Ends By</label>
        <div class="flex">
          <input
            id="start-date"
            class="input rounded-r-none focus:z-10"
            :class="{ 'error z-10': form.endDate.$hasError }"
            type="date"
            :min="form.startDate.$value"
            v-model="form.endDate.$value"
            @blur="form.endDate.$validate()"
          />
          <input
            id="start-time"
            class="input rounded-l-none ml-[-1px] focus:z-10"
            :class="{ error: form.endTime.$hasError }"
            type="time"
            v-model="form.endTime.$value"
            @blur="form.endTime.$validate()"
          />
        </div>
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
