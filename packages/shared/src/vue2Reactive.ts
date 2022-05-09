import { reactive, isVue2, isRef, type UnwrapRef } from 'vue-demi'

import { isObject, isArray, isRecord } from './typeGuards'

function vue2ReactiveImpl(obj: any): void {
  if (isObject(obj)) {
    for (const value of Object.values(obj)) {
      vue2ReactiveImpl(value)
    }
  }

  if (isArray(obj)) {
    for (let i = 0; i < obj.length; ++i) {
      if (isRecord(obj[i]) && !isRef(obj[i])) {
        reactive(obj[i])
      }
    }
  }
}

export function vue2Reactive<T>(obj: T): UnwrapRef<T> {
  if (isVue2 && isObject(obj)) {
    vue2ReactiveImpl(obj)
  }

  return reactive(obj as any)
}
