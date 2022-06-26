import type { Tuple } from '@internal/shared'
import type { Mock } from 'vitest'

export const makePromise = <T = undefined>(
  timeout: number,
  message?: T,
  mode: 'resolve' | 'reject' = 'resolve'
) =>
  new Promise<T>((resolve, reject) => {
    setTimeout(() => {
      if (mode === 'resolve') {
        // @ts-expect-error
        resolve(message)
      } else {
        reject(message)
      }
    }, timeout)
  })

type MakeMockOptions = {
  mockReturn?: (value: any, i: number) => any
  timeout?: number
  increasing?: number
  mode?: 'resolve' | 'reject'
}

export function makeMocks<N extends number>(
  amount: N,
  { mockReturn, timeout, increasing, mode }: MakeMockOptions | undefined = {}
): Tuple<Mock, N> {
  mockReturn ??= () => undefined
  increasing ??= 0
  mode ??= 'resolve'

  const mapping = (_: never, i: number) =>
    timeout
      ? vi.fn(value =>
          // @ts-expect-error TypeScript should figure this out
          makePromise(timeout + i * increasing, mockReturn(value, i), mode)
        )
      : // @ts-expect-error This as well
        vi.fn(value => mockReturn(value, i))

  return Array.from({ length: amount }, mapping) as any
}
