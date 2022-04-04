<script lang="ts">
import { defineComponent, computed, PropType } from '@vue/composition-api'

import AppIcon from '~/components/app/AppIcon.vue'
import FormErrors from './FormErrors.vue'

type FileHelper = {
  src: string
  file: File
}

export default defineComponent({
  components: {
    FormErrors,
    AppIcon
  },
  emits: {
    input: (files: File[]) => true
  },
  props: {
    label: {
      type: String
    },
    value: {
      type: Array as PropType<File[]>,
      required: true
    },
    errors: {
      type: Array as PropType<string[]>,
      default: () => []
    },
    image: {
      type: Boolean
    },
    multiple: {
      type: Boolean
    },
    accept: {
      type: String
    }
  },
  setup(props, { emit }) {
    const hasError = computed(() => props.errors.length > 0)
    const files = computed<File[]>({
      get(): File[] {
        return props.value
      },
      set(files) {
        emit('input', files)
      }
    })
    const fileHelpers = computed<FileHelper[]>(() =>
      files.value.map(file => ({
        src: URL.createObjectURL(file),
        file
      }))
    )
    const isFileSelected = computed<boolean>(() => fileHelpers.value.length > 0)

    const removeFile = (i: number) => {
      URL.revokeObjectURL(fileHelpers.value[i].src)
      files.value.splice(i, 1)
    }

    const unique = (files: File[]) => {
      const lookup = new Set<string>()
      return files.filter(f => {
        const keep = !lookup.has(f.name)
        lookup.add(f.name)
        return keep
      })
    }

    const handleChange = (e: Event) => {
      const input = e.target as HTMLInputElement
      const fileList = input.files
      if (fileList) {
        for (let i = 0; i < fileList.length; i++) {
          const file = fileList[i]
          files.value[i] = file
        }
        files.value = unique(files.value)
      }
      input.value = ''
    }

    return {
      hasError,
      isFileSelected,
      removeFile,
      handleChange,
      files,
      fileHelpers
    }
  }
})
</script>

<template>
  <div>
    <label class="label" :for="`file-${label}`">{{ label }}</label>
    <div
      :class="[
        'input border-2 group relative py-10 border-dashed grid place-items-center',
        { error: hasError }
      ]"
    >
      <input
        :id="`file-${label}`"
        class="w-full h-full absolute opacity-0 cursor-pointer"
        type="file"
        :accept="accept"
        :multiple="multiple"
        @change="handleChange"
      />
      <div class="text-center">
        <p>
          <span
            :class="[
              'font-semibold text-indigo-500 group-hover:text-indigo-700',
              { '!text-red-500 group-hover:!text-red-700': hasError }
            ]"
          >
            Upload a file
          </span>
          or drag and drop
        </p>
        <slot></slot>
        <div v-if="image && isFileSelected" class="flex flex-col items-center">
          <template v-for="{ file, src } in fileHelpers">
            <img
              :key="`img-${src}`"
              :src="src"
              class="w-32 h-32 mx-auto mb-2 mt-8"
            />
            <p :key="`p-${src}`">{{ file.name }}</p>
          </template>
        </div>
      </div>
    </div>
    <FormErrors :errors="errors" class="mt-1" />
    <ul v-if="files.length" class="mt-2">
      <li
        v-for="(file, i) in files"
        class="flex items-center cursor-pointer group"
        :key="file.name"
        @click="removeFile(i)"
      >
        <AppIcon icon="MinusCircle" class="mr-2 group-hover:text-red-700" />
        <span class="group-hover:line-through">{{ file.name }}</span>
      </li>
    </ul>
  </div>
</template>

<style lang="postcss" scoped></style>
