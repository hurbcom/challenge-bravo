package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/hurbcom/challenge-bravo/controllers"
	"github.com/hurbcom/challenge-bravo/models"
	"github.com/subosito/gotenv"
)

func init() {
	models.SuportedCoins = []string{"USD", "BRL", "EUR", "BTC", "ETH"}
}

func main() {
	err := gotenv.Load()
	if err != nil {
		log.Fatal(err)
	}
	router := gin.Default()

	router.GET("/exchange", controllers.Exchange)
	router.POST("/coin", controllers.CreateCoin)
	router.DELETE("/coin/:symbol", controllers.DeleteCoin)
	router.GET("/coin", func(c *gin.Context) {
		c.JSON(200, gin.H{"data": models.SuportedCoins})
		return
	})

	if err = router.Run(); err != nil {
		log.Fatal(err)
	}
}
