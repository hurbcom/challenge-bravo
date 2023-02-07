export type TSetRedisValue = {
  [key: string]: number
}

export interface IRedis {
  initRedisConnection: () => void
  setRedisValue: (key: string, value: string) => void
  multipleSetRedisValue: (records: TSetRedisValue) => void
  getRedisValue: (key: string) => Promise<string | null>
  removeRedisValue: (key: string) => Promise<void>
}
