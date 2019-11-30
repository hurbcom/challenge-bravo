import logger from '../services/logger'

export default (req, res, next) => {
  /**
   * Send an error for user
   *
   * @param error Object
   * @param code Number
   *
   * @return Response
   */
  res.sendError = function (error, code = 500) {
    logger.error({ message: error.message, code })

    return this.status(code).send(error)
  }

  next()
}
