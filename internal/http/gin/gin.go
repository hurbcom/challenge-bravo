package gin

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

const ERROR_STR = "error"

// Response gin info
// @Description Standard response to errors
type Message struct {
	StatusCode int   `swaggerignore:"true"`
	Message    gin.H `swaggertype:"object,string" example:"status:message"` // This is a json message
}

func NewErrorMessage() Message {
	return Message{
		StatusCode: http.StatusServiceUnavailable,
		Message:    gin.H{ERROR_STR: "internal error"},
	}
}
