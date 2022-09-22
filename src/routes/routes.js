import { Router } from 'express'
import exchangeRouter from './exchangesRoute.js'
import currenciesRouter from './currenciesRoute.js'

const router = Router()

router.use('/exchange', exchangeRouter)
router.use('/currencies', currenciesRouter)

export default router