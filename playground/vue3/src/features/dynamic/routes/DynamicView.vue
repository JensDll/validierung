<script setup lang="ts">
import { useValidation, ValidationError, type Field } from 'validierung'
import { useRoute } from 'vue-router'

import { stringify } from '~/common/stringify'
import { required } from '~/common/rules'

const route = useRoute()

type FormData = {
  a: Field<string>
  outer: {
    b: Field<string>
    inner: {
      c: Field<string>
      d: Field<number>
    }[]
  }[]
}

const {
  form,
  validating,
  submitting,
  hasError,
  errors,
  validateFields,
  resetFields,
  add,
  remove
} = useValidation<FormData>({
  a: {
    $value: '',
    $rules: [required('A is required')]
  },
  outer: []
})

addOuter()
addInner(0)

function addOuter() {
  add(['outer'], {
    b: {
      $value: '',
      $rules: [required('B is required')]
    },
    inner: []
  })
}

function removeOuter(outerIdx: number) {
  remove(['outer', outerIdx])
}

function addInner(outerIdx: number, c = '', d: number | undefined = undefined) {
  add(['outer', outerIdx, 'inner'], {
    c: {
      $value: c,
      $rules: [required('C is required')]
    },
    d: {
      $value: d as never,
      $rules: [required('D is required')]
    }
  })
}

function removeInner(outerIdx: number, innerIdx: number) {
  remove(['outer', outerIdx, 'inner', innerIdx])
}

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
    <div class="entry">
      <label class="label-a" for="a">A</label>
      <input
        id="a"
        class="input-a"
        :class="{ error: form.a.$hasError }"
        type="text"
        v-model="form.a.$value"
        @blur="form.a.$validate()"
      />
      <FormErrors class="error-a" :errors="form.a.$errors" />
      <div class="i-plus" @click="addOuter()"></div>
    </div>
    <section
      class="mt-8"
      v-for="(outer, outerIdx) in form.outer"
      :key="outer.b.$uid"
    >
      <div class="entry">
        <label class="label-b" :for="`b${outer.b.$uid}`">B</label>
        <input
          :id="`b${outer.b.$uid}`"
          class="input-b"
          :class="{ error: outer.b.$hasError }"
          type="text"
          v-model="outer.b.$value"
        />
        <FormErrors class="error-b" :errors="outer.b.$errors" />
        <div class="i-minus" @click="removeOuter(outerIdx)"></div>
        <div class="i-plus" @click="addInner(outerIdx)"></div>
      </div>
      <div
        class="entry mt-4"
        v-for="(inner, innerIdx) in outer.inner"
        :key="inner.c.$uid"
      >
        <label class="label-c" :for="`c${inner.c.$uid}`">C</label>
        <label class="label-d" :for="`d${inner.d.$uid}`">D</label>
        <input
          :id="`c${inner.c.$uid}`"
          class="input-c"
          :class="{ error: inner.c.$hasError }"
          type="text"
          v-model="inner.c.$value"
        />
        <input
          :id="`d${inner.d.$uid}`"
          class="input-d"
          :class="{ error: inner.d.$hasError }"
          type="number"
          v-model="inner.d.$value"
          @blur="inner.d.$validate()"
        />
        <FormErrors class="error-c" :errors="inner.c.$errors" />
        <FormErrors class="error-d" :errors="inner.d.$errors" />
        <div class="i-minus" @click="removeInner(outerIdx, innerIdx)"></div>
      </div>
    </section>
    <div>
      <button class="mt-10" type="submit">Submit</button>
      <button type="button" class="ml-3" @click="resetFields()">Reset</button>
    </div>
  </FormProvider>
</template>

<style scoped>
.entry {
  display: grid;
  grid-template-columns: 1fr 1fr 2rem 1.5rem;
  grid-template-areas:
    'label-1 label-2 . .'
    'input-1 input-2 minus plus'
    'error-1 error-2 . .';
  column-gap: 1rem;
}

.label-a,
.label-b {
  grid-area: label-1 / label-1 / label-2 / label-2;
}

.input-a,
.input-b {
  grid-area: input-1 / input-1 / input-2 / input-2;
}

.error-a,
.error-b {
  grid-area: error-1 / error-1 / error-2 / error-2;
}

.label-c {
  grid-area: label-1;
}

.label-d {
  grid-area: label-2;
}

.input-c {
  grid-area: input-1;
}

.input-d {
  grid-area: input-2;
}

.error-c {
  grid-area: error-1;
}

.error-d {
  grid-area: error-2;
}

.i-plus,
.i-minus {
  align-self: center;
}

.i-plus {
  @apply i-heroicons-plus-circle;
  grid-area: plus;
}

.i-minus {
  @apply i-heroicons-minus-circle;
  grid-area: minus;
  justify-self: end;
}

@screen md {
  .entry {
    grid-template-columns: 1fr 1fr 3rem 1.5rem;
  }
}
</style>
