import { isObject, isArray } from './typeGuards'
import type { AnyObject } from './types'

function deepCopyImpl(toCopy: AnyObject, copy: AnyObject) {
  for (const [key, value] of Object.entries(toCopy)) {
    if (
      isObject(value) &&
      !(value instanceof File) &&
      !(value instanceof FileList) &&
      !(value instanceof Date) &&
      !(value instanceof Map) &&
      !(value instanceof Set) &&
      !(value instanceof ArrayBuffer)
    ) {
      copy[key] = isArray(value) ? [] : {}
      deepCopyImpl(value, copy[key])
    } else {
      copy[key] = value
    }
  }
}

export function deepCopy<T>(toCopy: T): T {
  if (!isObject(toCopy)) {
    return toCopy
  }

  const copy = isArray(toCopy) ? [] : {}

  deepCopyImpl(toCopy, copy)

  return copy as T
}
