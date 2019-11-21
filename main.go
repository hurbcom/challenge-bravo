package main

import (
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/hurbcom/challenge-bravo/controllers"
	"github.com/hurbcom/challenge-bravo/models"
	"github.com/subosito/gotenv"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"

	"github.com/hurbcom/challenge-bravo/docs"
)

func init() {
	models.SuportedCoins = []string{"USD", "BRL", "EUR", "BTC", "ETH"}
	docs.SwaggerInfo.Title = "hurbcom Test API"
	docs.SwaggerInfo.Host = "localhost:8080"
	docs.SwaggerInfo.Schemes = []string{"http"}

}
func main() {
	err := gotenv.Load()
	if err != nil {
		log.Fatal(err)
	}
	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowAllOrigins: true,
		AllowMethods:    []string{"PUT", "GET", "DELETE", "POST"},
		AllowHeaders:    []string{"Content-type", "Authorization"},
		ExposeHeaders:   []string{"Content-Length", "Content-type"},
		MaxAge:          36000,
	}))

	router.GET("/price-conversion", controllers.Conversion)
	router.GET("/coin",
		func(c *gin.Context) {
			c.JSON(200, gin.H{"data": models.SuportedCoins})
			return
		})
	router.POST("/coin", controllers.CreateCoin)
	router.DELETE("/coin/:symbol", controllers.DeleteCoin)

	swagger := router.Group("/docs", gin.BasicAuth(gin.Accounts{
		"hurbcom": "123",
	}))
	swagger.GET("/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	if err = router.Run(); err != nil {
		log.Fatal(err)
	}
}
