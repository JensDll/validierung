export class PromiseCancel<T = unknown> {
  private promise!: Promise<T>
  private resolve!: (value: T | PromiseLike<T>) => void
  private reject!: (reason?: any) => void

  isRacing = false

  constructor() {
    this.assign()
  }

  cancelResolve(value: T | PromiseLike<T>) {
    if (this.isRacing) {
      this.isRacing = false
      this.resolve(value)
      this.assign()
    }
  }

  cancelReject(reason?: any) {
    if (this.isRacing) {
      this.isRacing = false
      this.reject(reason)
      this.assign()
    }
  }

  async race<Ps extends readonly Promise<any>[]>(...promises: [...Ps]) {
    this.isRacing = true

    let result

    try {
      result = await Promise.race([this.promise, ...promises])
    } finally {
      this.isRacing = false
    }

    return result
  }

  private assign() {
    this.promise = new Promise<T>((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
    })
  }
}
