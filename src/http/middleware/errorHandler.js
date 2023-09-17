import { BadRequestError, NotFoundError } from '../../utils/apiError.js'

// eslint-disable-next-line no-unused-vars
function errorHandler (error, request, response, next) {
  if (error instanceof NotFoundError) {
    return response.status(error.statusCode).json({
      message: error.message
    })
  }
  if (error instanceof BadRequestError) {
    return response.status(error.statusCode).json({
      message: error.message
    })
  }

  console.log(error)
  return response.status(500).json({
    message: `Internal seerver error - ${error.message}`
  })
}

export { errorHandler }
