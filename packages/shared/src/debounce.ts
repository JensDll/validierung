type DebounceOptions = {
  wait: number
}

export type Debounced<Args extends unknown[]> = {
  (...args: [...Args]): void
  cancel(): void
}

export function debounce<Args extends unknown[]>(
  target: (...args: [...Args]) => void,
  { wait }: DebounceOptions
): Debounced<Args>

export function debounce(
  target: (...args: any[]) => void,
  { wait }: DebounceOptions
) {
  let timerId: NodeJS.Timeout | null = null

  function cancel() {
    clearTimeout(timerId as any)
    timerId = null
  }

  function debounced(this: any, ...args: any[]) {
    const effect = () => {
      timerId = null
      target.apply(this, args)
    }

    clearTimeout(timerId as any)
    timerId = setTimeout(effect, wait)
  }

  debounced.cancel = cancel

  return debounced
}
