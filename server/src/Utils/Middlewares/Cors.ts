import { CorsOptions } from 'cors'

export const whitelist = ['http://localhost:3001']

export const corsOptions = {
  origin: (
    origin: string,
    callback: (err: Error | null, origin?: boolean) => void
  ) => {
    if (
      whitelist.indexOf(origin) !== -1 ||
      process.env.NODE_ENV !== 'production'
    ) {
      callback(null, true)
    } else {
      callback(new Error('Not the same origin'))
    }
  }
} as CorsOptions
