import { AnyObject } from './types'

export function path(path: readonly PropertyKey[], obj: AnyObject): any {
  let value = obj[path[0]]

  for (let i = 0; i < path.length; i++) {
    const key = path[i]

    if (value === null || value === undefined) {
      return undefined
    }

    if (i > 0) {
      value = value[key]
    }
  }

  return value
}
