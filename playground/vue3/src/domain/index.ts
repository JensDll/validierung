export { rules } from './rules'
export { compare } from './compare'
export { guards } from './typeGuards'
export { type Lengthy } from './types'

export const stringify = (value: unknown) =>
  JSON.stringify(
    value,
    (key, value) => {
      if (value === undefined) {
        return 'undefined'
      }
      if (typeof value === 'function') {
        return 'function'
      }
      if (value instanceof File) {
        return `File { name: ${value.name} }`
      }
      return value
    },
    2
  )
