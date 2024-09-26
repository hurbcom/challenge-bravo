package exception

import "net/http"

type BadRequestException struct {
	Code    int    `json:"code" example:"400"`
	Message string `json:"message" example:"bad request"`
}

func (e *BadRequestException) Error() string {
	return e.Message
}

func BadRequest(message string) *HttpException {
	return &HttpException{
		Code:    http.StatusBadRequest,
		Message: message,
	}
}
