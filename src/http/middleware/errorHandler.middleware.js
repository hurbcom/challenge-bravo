import { BadRequestError, NotFoundError } from '../../utils/apiError.js'

function errorHandlerMiddleware (error, req, res, next) {
  if (error instanceof NotFoundError) {
    return res.status(error.statusCode).json({
      message: error.message
    })
  }
  if (error instanceof BadRequestError) {
    return res.status(error.statusCode).json({
      message: error.message
    })
  }

  console.log(error)
  return res.status(500).json({
    message: `Internal seerver error - ${error.message}`
  })
}

export { errorHandlerMiddleware }
