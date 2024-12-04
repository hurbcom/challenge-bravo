package gin

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"time"
)

// returnHeaders - set application/json
func returnHeaders() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Content-Type", "application/json")
		c.Next()
	}
}

// customLogger -
func customLogger() gin.HandlerFunc {
	return gin.LoggerWithFormatter(func(param gin.LogFormatterParams) string {

		// your custom format
		msg := fmt.Sprintf("%s [%s] [%d] [src: %s] %s  %s %s\n",
			param.TimeStamp.Format(time.RFC3339),
			param.Method,
			param.StatusCode,
			param.ClientIP,
			param.Path,
			param.Latency,
			param.ErrorMessage,
		)
		return msg
	})
}
