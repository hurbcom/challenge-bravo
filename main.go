package main

import (
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/hurbcom/challenge-bravo/controllers"
	"github.com/hurbcom/challenge-bravo/dao"
	"github.com/subosito/gotenv"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"

	"github.com/hurbcom/challenge-bravo/docs"
)

func init() {
	dao.SuportedCoins = []string{"USD", "BRL", "EUR", "BTC", "ETH"}
	docs.SwaggerInfo.Title = "hurbcom Test API"
	docs.SwaggerInfo.Host = "localhost:8080"
	docs.SwaggerInfo.Schemes = []string{"http", "https"}

}

func SetUpRoutes() *gin.Engine {
	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowAllOrigins: true,
		AllowMethods:    []string{"PUT", "GET", "DELETE", "POST"},
		AllowHeaders:    []string{"Content-type", "Authorization"},
		ExposeHeaders:   []string{"Content-Length", "Content-type"},
		MaxAge:          36000,
	}))

	router.GET("/price-conversion", controllers.Conversor)
	router.GET("/coin", controllers.GetCoin)
	router.POST("/coin", controllers.CreateCoin)
	router.DELETE("/coin/:symbol", controllers.DeleteCoin)

	swagger := router.Group("/docs", gin.BasicAuth(gin.Accounts{
		"hurbcom": "123",
	}))
	swagger.GET("/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	return router
}

func main() {
	err := gotenv.Load()
	if err != nil {
		log.Fatal(err)
	}
	router := SetUpRoutes()

	if err = router.Run(); err != nil {
		log.Fatal(err)
	}
}
