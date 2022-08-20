import { Router } from 'express'
import exchangeRouter from './exchangesRoute.js'
import currenciesRouter from './currenciesRoute.js'

const router = Router()

router.use(exchangeRouter)
router.use(currenciesRouter)

export default router