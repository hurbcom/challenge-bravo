package exception

import "net/http"

type InternalServerException struct {
	Code    int    `json:"code" example:"500"`
	Message string `json:"message" example:"internal server error"`
}

func (e *InternalServerException) Error() string {
	return e.Message
}

func InternalServer(message string) *HttpException {
	return &HttpException{
		Code:    http.StatusInternalServerError,
		Message: message,
	}
}
