type TData = {
  [key: string]: number
}
export let dataRedis = {
  asd: 1
} as TData

export const initRedisConnection = async () => {}
export const setRedisValue = async (key: string, value: number) => {
  dataRedis[key] = value
}
export const getRedisValue = async (key: string): Promise<number | null> =>
  new Promise((resolve) => resolve(dataRedis[key]))

export const removeRedisValue = async (key: string): Promise<void> =>
  new Promise((resolve) => {
    delete dataRedis[key]
    resolve()
  })
