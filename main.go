package main

import (
	"github.com/gin-gonic/gin"
	"github.com/hurbcom/challenge-bravo/controllers"
	"github.com/hurbcom/challenge-bravo/models"
	"github.com/subosito/gotenv"
)

func init() {
	models.SuportedCoins = []string{"USD", "BRL", "EUR", "BTC", "ETH"}
}

func main() {
	_ = gotenv.Load()

	router := gin.Default()

	router.GET("/exchange", controllers.Exchange)
	router.POST("/coin")
	router.DELETE("/coin")
	router.GET("/coin", func(c *gin.Context) {
		c.JSON(200, gin.H{"data": models.SuportedCoins})
		return
	})

	_ = router.Run()
}
