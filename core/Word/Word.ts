export type WordGroup = readonly [string, string, string]

export type WordsCollection = readonly WordGroup[]

export interface Word {
  readonly correctOption: string
  readonly wrongOptions: [string, string]
  readonly audioText: string
}
