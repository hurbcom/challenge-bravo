export interface IRedis {
  initRedisConnection: () => void
  setRedisValue: (key: string, value: string) => void
  getRedisValue: (key: string) => Promise<string | null>
  removeRedisValue: (key: string) => Promise<void>
}
