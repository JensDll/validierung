<script lang="ts">
import { defineComponent } from 'vue'
import { useValidation, Field } from 'validierung'

import FormProvider from '~/components/form/FormProvider.vue'
import AppButton from '~/components/app/AppButton.vue'
import PlusCircleIcon from '~/components/icon/PlusCircleIcon.vue'
import MinusCircleIcon from '~/components/icon/MinusCircleIcon.vue'
import { stringify } from '~/domain'

type FormData = {
  a: Field<string>
  outerList: {
    b: Field<string>
    innerList: {
      c: Field<string>
      d: Field<string>
    }[]
  }[]
}

export default defineComponent({
  components: {
    FormProvider,
    PlusCircleIcon,
    MinusCircleIcon,
    AppButton
  },
  setup() {
    const val = useValidation<FormData>({
      a: {
        $value: '',
        $rules: []
      },
      outerList: []
    })

    function addOuter() {
      val.add(['outerList'], {
        b: {
          $value: '',
          $rules: []
        },
        innerList: []
      })
    }

    function addInner(outerIndex: number) {
      val.add(['outerList', outerIndex, 'innerList'], {
        c: {
          $value: '',
          $rules: [
            {
              key: 'a',
              rule() {}
            },
            {
              key: 'a',
              rule() {}
            },
            {
              key: 'a',
              rule() {}
            }
          ]
        },
        d: {
          $value: '',
          $rules: [
            {
              key: 'a',
              rule() {}
            },
            {
              key: 'a',
              rule(...values) {
                console.log(values)
              }
            }
          ]
        }
      })
    }

    function removeOuter(outerIndex: number) {
      val.remove(['outerList', outerIndex])
    }

    function removeInner(outerIndex: number, innerIndex: number) {
      val.remove(['outerList', outerIndex, 'innerList', innerIndex])
    }

    addOuter()
    addInner(0)

    async function handleSubmit() {
      try {
        const formData = await val.validateFields()
        alert(stringify(formData))
      } catch {}
    }

    return {
      ...val,
      handleSubmit,
      addOuter,
      addInner,
      removeOuter,
      removeInner
    }
  }
})
</script>

<template>
  <FormProvider
    title="Dynamic Form"
    :val="{ form, validating, submitting, errors, hasError }"
    @submit="handleSubmit()"
  >
    <div>
      <label class="label" :for="form.a.$uid.toString()">A</label>
      <div class="flex items-center">
        <input
          :id="form.a.$uid.toString()"
          class="input"
          type="text"
          v-model="form.a.$value"
          @blur="form.a.$validate()"
        />
        <PlusCircleIcon class="ml-6" @click="addOuter()" />
      </div>
    </div>
    <div
      v-for="(outer, outerIndex) in form.outerList"
      :key="outer.b.$uid"
      class="mt-6"
    >
      <div>
        <label class="label" :for="outer.b.$uid.toString()"> B </label>
        <div class="flex items-center">
          <input
            :id="outer.b.$uid.toString()"
            class="input"
            type="text"
            v-model="outer.b.$value"
            @blur="outer.b.$validate()"
          />
          <PlusCircleIcon class="ml-6" @click="addInner(outerIndex)" />
          <MinusCircleIcon class="ml-3" @click="removeOuter(outerIndex)" />
        </div>
      </div>
      <div
        v-for="(inner, innerIndex) in outer.innerList"
        :key="inner.c.$uid"
        class="mt-2 flex"
      >
        <div>
          <label class="label" :for="inner.c.$uid.toString()"> C </label>
          <input
            :id="inner.c.$uid.toString()"
            class="input"
            type="text"
            v-model="inner.c.$value"
            @blur="inner.c.$validate()"
          />
        </div>
        <div>
          <label class="label ml-6" :for="inner.d.$uid.toString()"> D </label>
          <div class="flex items-center">
            <input
              :id="inner.d.$uid.toString()"
              class="ml-6 input"
              type="text"
              v-model="inner.d.$value"
              @blur="inner.d.$validate()"
            />
            <MinusCircleIcon
              class="ml-6"
              @click="removeInner(outerIndex, innerIndex)"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="mt-12">
      <AppButton
        class="mr-4"
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
