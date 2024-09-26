package route

import (
	"github.com/gin-gonic/gin"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/infra/middleware"
)

func Init() *gin.Engine {
	router := gin.New()

	router.Use(middleware.Log)
	router.Use(gin.CustomRecovery(middleware.ExceptionHandler))

	v1 := router.Group("/v1")

	handleSwagger(v1)
	handleUser(v1)
	handleCurrency(v1)
	handleAuth(v1)

	return router
}
