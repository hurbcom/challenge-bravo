type TData = {
  [key: string]: string
}
export let dataRedis = {} as TData

export const createClient = () => {}
export const connect = () => {}

export const set = (key: string, value: string) => {
  return new Promise((resolve) => {
    dataRedis[key] = value

    resolve('OK')
  })
}
export const get = (key: string) => {
  return new Promise((resolve) => {
    resolve(dataRedis[key] || null)
  })
}
export const del = (key: string) => {
  return new Promise((resolve) => {
    delete dataRedis[key]

    resolve(null)
  })
}
