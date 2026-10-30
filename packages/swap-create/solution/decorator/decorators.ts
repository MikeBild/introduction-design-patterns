import type { Measure } from '../../src/decorator/shop.ts'

export type AsyncFn<Args extends unknown[], Result> = (...args: Args) => Promise<Result>

export const withTiming =
  <Args extends unknown[], Result>(
    fn: AsyncFn<Args, Result>,
    name: string,
    record: (measure: Measure) => void,
    now = () => performance.now(),
  ): AsyncFn<Args, Result> =>
  async (...args) => {
    const start = now()
    try {
      return await fn(...args)
    } finally {
      record({ name, ms: now() - start })
    }
  }

export const withRetry =
  <Args extends unknown[], Result>(
    fn: AsyncFn<Args, Result>,
    { attempts, retryOn }: { attempts: number; retryOn: (error: unknown) => boolean },
  ): AsyncFn<Args, Result> =>
  async (...args) => {
    for (let attempt = 1; ; attempt += 1) {
      try {
        return await fn(...args)
      } catch (error) {
        if (attempt >= attempts || !retryOn(error)) throw error
      }
    }
  }

export const withCache = <Args extends unknown[], Result>(
  fn: AsyncFn<Args, Result>,
): AsyncFn<Args, Result> => {
  const known = new Map<string, Result>()

  return async (...args) => {
    const key = JSON.stringify(args)
    if (known.has(key)) return known.get(key) as Result

    const result = await fn(...args)
    known.set(key, result)
    return result
  }
}
