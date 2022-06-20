<script setup lang="ts">
import { useValidation, ValidationError, type Field } from 'validierung'
import { useRoute } from 'vue-router'

import { stringify, compare } from '~/domain'

const route = useRoute()

type FormData = {
  startDate: Field<string>
  startTime: Field<string>
  endDate: Field<string>
  endTime: Field<string>
}

const requiredDate = (date: string, time: string) => {
  if (!date && !time) {
    return Symbol.toStringTag
  }

  if (!date) {
    return 'Please select a date'
  }
}

const requiredTime = (date: string, time: string) => {
  if (!date && !time) {
    return 'Please select a date and time'
  }

  if (!time) {
    return 'Please select a time'
  }
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
  startDate: {
    $value: '',
    $rules: [
      ['change', { key: 'start', rule: requiredDate }],
      { key: 'date-and-time' }
    ]
  },
  startTime: {
    $value: '',
    $rules: [
      ['change', { key: 'start', rule: requiredTime }],
      { key: 'date-and-time' }
    ]
  },
  endDate: {
    $value: '',
    $rules: [
      ['change', { key: 'end', rule: requiredDate }],
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
              return 'Please select a later combination'
            }
          }
        }
      ]
    ]
  },
  endTime: {
    $value: '',
    $rules: [
      ['change', { key: 'end', rule: requiredTime }],
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

            if (compare.date(startDate, endDate) === 0 && startTime > endTime) {
              return 'Please select a later combination'
            }
          }
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
    <section class="datetime-range">
      <label class="grid-area-[start-label]" for="start-date">Starts</label>
      <input
        class="grid-area-[start-date]"
        :class="{ error: form.startDate.$hasError }"
        id="start-date"
        type="date"
        v-model="form.startDate.$value"
        :min="new Date().toLocaleDateString('en-CA')"
        :max="form.endDate.$value"
        @blur="form.startDate.$validate()"
      />
      <input
        class="grid-area-[start-time]"
        :class="{ error: form.startTime.$hasError }"
        type="time"
        v-model="form.startTime.$value"
        @blur="form.startTime.$validate()"
      />
      <FormErrors
        class="grid-area-[start-error]"
        :errors="[...form.startDate.$errors, ...form.startTime.$errors]"
      />
      <div class="grid-area-[hyphen] hidden place-self-center xl:block">-</div>
      <label class="grid-area-[end-label] mt-4 xl:mt-0" for="end-date">
        Ends by
      </label>
      <input
        class="grid-area-[end-date]"
        :class="{ error: form.endDate.$hasError }"
        id="end-date"
        type="date"
        v-model="form.endDate.$value"
        :min="form.startDate.$value || new Date().toLocaleDateString('en-CA')"
        @blur="form.endDate.$validate()"
      />
      <input
        class="grid-area-[end-time]"
        :class="{ error: form.endTime.$hasError }"
        type="time"
        v-model="form.endTime.$value"
        @blur="form.endTime.$validate()"
      />
      <FormErrors
        class="grid-area-[end-error]"
        :errors="[...form.endDate.$errors, ...form.endTime.$errors]"
      />
    </section>
    <div class="clear-left">
      <button class="mt-10" type="submit">Submit</button>
      <button type="button" class="ml-2" @click="resetFields()">Reset</button>
    </div>
  </FormProvider>
</template>

<style scoped>
.datetime-range {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  grid-template-areas:
    'start-label start-label'
    'start-date start-time'
    'start-error start-error'
    'end-label end-label'
    'end-date end-time'
    'end-error end-error';
  @apply gap-x-4;
}

@screen xl {
  .datetime-range {
    grid-template-columns: 1.5fr 1fr auto 1.5fr 1fr;
    grid-template-areas:
      'start-label start-label . end-label end-label'
      'start-date start-time hyphen end-date end-time'
      'start-error start-error . end-error end-error';
  }
}
</style>
