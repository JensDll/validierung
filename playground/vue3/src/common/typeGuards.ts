export const isDefinedGuard = <T>(x: T | null | undefined): x is T =>
  x !== null && typeof x !== 'undefined'

export const isFormElement = (el: HTMLElement): el is HTMLFormElement =>
  el.tagName === 'FORM'
