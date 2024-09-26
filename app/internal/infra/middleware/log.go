package middleware

import (
	"time"

	"github.com/gin-gonic/gin"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/infra/service"
)

func Log(c *gin.Context) {
	start := time.Now()

	log := service.NewLogService()

	c.Next()

	log.Info("incoming request", map[string]any{
		"method":      c.Request.Method,
		"url":         c.Request.URL.String(),
		"user_agent":  c.Request.UserAgent(),
		"elapsed_ms":  time.Since(start),
		"status_code": c.Writer.Status(),
	})
}
