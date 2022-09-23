import { isAppError, errorTypeToStatusCode } from '../utils/errorUtils.js'

export default function errorHandler(error, req, res, next) {
	if (isAppError(error)) {
		return res.status(errorTypeToStatusCode(error.type)).send(error.message)
	}

	return res.sendStatus(500)
}
