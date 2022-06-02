<script setup lang="ts">
import { useValidation, ValidationError, type Field } from 'validierung'

import { rules, stringify } from '~/domain'

type FormData = {
  alfa: Field<string>
  outer: {
    bravo: Field<string>
    inner: {
      charlie: Field<string>
      delta: Field<number>
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
  alfa: {
    $value: ''
  },
  outer: [
    {
      bravo: {
        $value: ''
      },
      inner: []
    }
  ]
})

addInner(0, '', 42)

function addOuter() {
  add(['outer'], {
    bravo: {
      $value: ''
    },
    inner: []
  })
}

function removeOuter(outerIdx: number) {
  remove(['outer', outerIdx])
}

function addInner(
  outerIdx: number,
  charlie = '',
  delta: number | undefined = undefined
) {
  add(['outer', outerIdx, 'inner'], {
    charlie: {
      $value: charlie
    },
    delta: {
      $value: delta as never,
      $rules: [rules.required('This field is required')]
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
    :title="$route.meta.title"
    :validation="{ form, validating, submitting, hasError, errors }"
    @submit="handleSubmit()"
  >
    <section>
      <section class="entry">
        <div class="col-span-2">
          <label for="alfa">Alfa</label>
          <input id="alfa" type="text" v-model="form.alfa.$value" />
        </div>
        <div class="i-plus" @click="addOuter()"></div>
      </section>
      <section
        class="mt-8"
        v-for="(outer, outerIdx) in form.outer"
        :key="outer.bravo.$uid"
      >
        <section class="entry">
          <div class="col-span-2">
            <label :for="`bravo${outer.bravo.$uid}`">Bravo</label>
            <input
              :id="`bravo${outer.bravo.$uid}`"
              type="text"
              v-model="outer.bravo.$value"
            />
          </div>
          <div class="i-minus" @click="removeOuter(outerIdx)"></div>
          <div class="i-plus" @click="addInner(outerIdx)"></div>
        </section>
        <section
          class="mt-4"
          v-for="(inner, innerIdx) in outer.inner"
          :key="inner.charlie.$uid"
        >
          <section class="entry">
            <div>
              <label :for="`charlie${inner.charlie.$uid}`">Charlie</label>
              <input
                :id="`charlie${inner.charlie.$uid}`"
                type="text"
                v-model="inner.charlie.$value"
              />
            </div>
            <div>
              <label :for="`delta${inner.delta.$uid}`">Delta</label>
              <input
                :id="`delta${inner.delta.$uid}`"
                type="number"
                v-model="inner.delta.$value"
                @blur="inner.delta.$validate()"
              />
              <FormErrors :errors="inner.delta.$errors" />
            </div>
            <div class="i-minus" @click="removeInner(outerIdx, innerIdx)"></div>
          </section>
        </section>
      </section>
      <div>
        <button class="mt-10" type="submit">Submit</button>
        <button type="button" class="ml-2" @click="resetFields()">Reset</button>
      </div>
    </section>
  </FormProvider>
</template>

<style scoped>
.entry {
  display: grid;
  grid-template-columns: 1fr 1fr 3rem 1.5rem;
  grid-template-areas: '. . minus plus';
  column-gap: 1rem;
}

.i-minus,
.i-plus {
  justify-self: end;
  margin-top: 29px;
}

.i-plus {
  grid-area: plus;
}

.i-minus {
  grid-area: minus;
}
</style>
