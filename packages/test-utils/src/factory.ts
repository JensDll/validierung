export const makePromise = <T = undefined>(
  timeout: number,
  message: T,
  mode: 'resolve' | 'reject' = 'resolve'
) =>
  new Promise<T>((resolve, reject) => {
    setTimeout(() => {
      if (mode === 'resolve') {
        resolve(message)
      } else {
        reject(message)
      }
    }, timeout)
  })
