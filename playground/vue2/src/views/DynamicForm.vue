<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { useValidation, Field } from 'validierung'

import FormProvider from '~/components/form/FormProvider.vue'
import AppButton from '~/components/app/AppButton.vue'
import PlusCircleIcon from '~/components/icon/PlusCircleIcon.vue'
import MinusCircleIcon from '~/components/icon/MinusCircleIcon.vue'

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
        $value: ''
      },
      outerList: []
    })

    function addOuter() {
      val.add(['outerList'], {
        b: {
          $value: ''
        },
        innerList: []
      })
    }

    function addInner(outerIndex: number) {
      val.add(['outerList', outerIndex, 'innerList'], {
        c: {
          $value: ''
        },
        d: {
          $value: ''
        }
      })
    }

    function removeOuter(outerIndex: number) {
      val.remove(['outerList', outerIndex])
    }

    function removeInner(outerIndex: number, innerIndex: number) {
      val.remove(['outerList', outerIndex, 'innerList', innerIndex])
    }

    async function handleSubmit() {
      try {
        const formData = await val.validateFields()
        console.log(JSON.stringify(formData, null, 2))
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
    form-class="grid justify-items-start"
    @submit="handleSubmit()"
  >
    <div class="grid grid-cols-[auto_auto] grid-rows-[auto_auto]">
      <label class="block font-medium" :for="form.a.$uid.toString()">A</label>
      <div></div>
      <input
        :id="form.a.$uid.toString()"
        class="border-2"
        type="text"
        v-model="form.a.$value"
      />
      <PlusCircleIcon
        class="w-6 h-6 ml-6 cursor-pointer self-center text-emerald-600 hover:text-emerald-700"
        @click="addOuter()"
      />
    </div>
    <div
      v-for="(outer, outerIndex) in form.outerList"
      :key="outer.b.$uid"
      class="mt-6 grid justify-items-start"
    >
      <div class="grid grid-cols-[auto_auto_auto] grid-rows-[auto_auto]">
        <label class="block font-medium" :for="outer.b.$uid.toString()">
          B
        </label>
        <div class="col-span-2"></div>
        <input
          :id="outer.b.$uid.toString()"
          class="border-2"
          type="text"
          v-model="outer.b.$value"
        />
        <PlusCircleIcon
          class="w-6 h-6 ml-6 cursor-pointer self-center text-emerald-600 hover:text-emerald-700"
          @click="addInner(outerIndex)"
        />
        <MinusCircleIcon
          class="w-6 h-6 ml-3 cursor-pointer self-center text-red-600 hover:text-red-700"
          @click="removeOuter(outerIndex)"
        />
      </div>
      <div
        v-for="(inner, innerIndex) in outer.innerList"
        :key="inner.c.$uid"
        class="grid grid-cols-[auto_auto_auto] grid-rows-[auto_auto] mt-2"
      >
        <label class="block font-medium" :for="inner.c.$uid.toString()">
          C
        </label>
        <label class="block ml-6 font-medium" :for="inner.d.$uid.toString()">
          D
        </label>
        <div></div>
        <input
          :id="inner.c.$uid.toString()"
          class="border-2"
          type="text"
          v-model="inner.c.$value"
        />
        <input
          :id="inner.d.$uid.toString()"
          class="ml-6 border-2"
          type="text"
          v-model="inner.d.$value"
        />
        <MinusCircleIcon
          class="w-6 h-6 ml-6 self-center cursor-pointer text-red-600 hover:text-red-700"
          @click="removeInner(outerIndex, innerIndex)"
        />
      </div>
    </div>
    <div class="mt-12">
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
