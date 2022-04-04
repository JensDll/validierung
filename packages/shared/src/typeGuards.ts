import { AnyObject } from './types'

export const isDefined = <T>(value: T | null | undefined): value is T =>
  value !== null && value !== undefined

export const isRecord = (value: unknown): value is AnyObject =>
  isObject(value) && !Array.isArray(value)

export const isArray = (value: unknown): value is any[] => Array.isArray(value)

export const isObject = (value: unknown): value is AnyObject =>
  typeof value === 'object' && value !== null
