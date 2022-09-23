export function isAppError(error) {
   return (error).type !== undefined
}

export function errorTypeToStatusCode(type) {
	if (type === 'conflict') return 409
	if (type === 'not_found') return 404
	if (type === 'unprocessable_entity') return 422
	if (type === 'bad_request') return 400
}
