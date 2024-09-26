package exception

import "net/http"

type NotFoundException struct {
	Code    int    `json:"code" example:"404"`
	Message string `json:"message" example:"not found"`
}

func (e *NotFoundException) Error() string {
	return e.Message
}

func NotFound(message string) *HttpException {
	return &HttpException{
		Code:    http.StatusNotFound,
		Message: message,
	}
}
