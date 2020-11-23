import HttpError from './model/HttpError';

const handleErrors = (err, req, res, next) => {
  if (err instanceof HttpError) {
    return res.status(err.getCode()).json({
      message: err.message
    });
  }

  return res.status(500).json({
    message: err.message
  });
}


export default handleErrors;