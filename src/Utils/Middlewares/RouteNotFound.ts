import { Request, Response } from 'express'

export const RouteNotFound = (req: Request, res: Response): Response<void> => {
  return res.status(404).json({ success: false })
}
