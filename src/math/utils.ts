type Indexable = string | number | symbol

// https://stackoverflow.com/questions/8435183/generate-a-weighted-random-number
export function weightedRand<T extends Indexable>(spec: Record<T, number>): () => T {
    const table: T[] = []
    for (const i in spec) {
      // The constant 10 below should be computed based on the
      // weights in the spec for a correct and optimal table size.
      // E.g. the spec {0:0.999, 1:0.001} will break this impl.
      for (let j = 0; j < spec[i] * 10; j++) {
        table.push(i)
      }
    }
    return function () {
      return table[Math.floor(Math.random() * table.length)]
    }
  }

  export const formatNumber = (x: number) => x.toString().indexOf('.') >= 0 ? x.toFixed(2) : x