import { CorsOptions } from 'cors'

export const whitelist = ['http://localhost:3001']

export const corsOptions = {
  origin: (
    origin: string,
    callback: (err: Error | null, origin?: boolean) => void
  ) => {
    if (!whitelist.includes(origin) || process.env.NODE_ENV !== 'production') {
      const NO_ERROR = null
      const ORIGIN_OK = true

      callback(NO_ERROR, ORIGIN_OK)
    } else {
      callback(new Error('Not the same origin'))
    }
  }
} as CorsOptions
