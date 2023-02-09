import { NextFunction, Request, Response } from 'express'
import { whitelist } from './Cors'

export const setHearders = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let allowOrigin = '*'
  if (process.env.NODE_ENV === 'production') {
    allowOrigin = whitelist.join(',')
  }

  res.setHeader('cache-control', 'max-age=0, no-cache, no-store')

  res.setHeader('Access-Control-Allow-Origin', allowOrigin)

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Origin, Accept')
  res.setHeader('Content-Secure-Policy', 'default-src')
  res.setHeader('x-content-type-options', 'nosniff')

  res.removeHeader('X-Powered-By')

  next()
}
