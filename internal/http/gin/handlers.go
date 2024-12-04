package gin

import (
	"net/http"

	"github.com/danielmalka/challenge-bravo/application/currency"
	docs "github.com/danielmalka/challenge-bravo/docs"
	"github.com/gin-gonic/gin"
	swaggerfiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

func Handlers(appStage string, service *currency.Service, response Message) *gin.Engine {
	if appStage == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	r := gin.Default()
	r.Use(gin.Recovery())
	r.Use(customLogger())
	r.Use(returnHeaders())

	docs.SwaggerInfo.BasePath = "/"
	r.GET("", getHome())

	// @BasePath /v1
	v1 := r.Group("/v1")
	{
		// Currency Routes
		v1.GET("/currency", listCurrency(service, response))
		v1.POST("/currency", createCurrency(service, response))
		v1.PUT("/currency/:id", updateCurrency(service, response))
		v1.DELETE("/currency/:id", deleteCurrency(service, response))
		// Conversion Routes
		v1.GET("/conversion", doConversion(service, response))
	}
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerfiles.Handler))
	return r
}

// getHome godoc
// @Summary Returns the API version
// @Schemes
// @Description Current API version
// @Tags Version
// @Produce json
// @Success 200 {object} gin.Message
// @Router / [get]
func getHome() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"version": "1.0.0"})
	}
}
