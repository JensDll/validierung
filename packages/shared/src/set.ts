import { set as vueSet, isVue3 } from 'vue-demi'

import { Key, AnyRecord } from './types'

export function set(obj: AnyRecord, keys: readonly Key[], value: any) {
  if (keys.length === 0) {
    return
  }

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    const nextKey = keys[i + 1]
    const value = obj[key]

    if (value === undefined) {
      if (typeof nextKey !== 'symbol' && Number.isNaN(+nextKey)) {
        obj[key] = {}
      } else {
        obj[key] = []
      }
    }

    obj = obj[key]
  }

  if (isVue3) {
    obj[keys[keys.length - 1]] = value
  } else {
    vueSet(obj, keys[keys.length - 1], value)
  }
}
