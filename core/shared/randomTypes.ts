export type RandomIntFn = (maxExclusive: number) => number

export type ShuffleFn = <T>(items: readonly T[]) => T[]
