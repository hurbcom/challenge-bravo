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

	_ = router.Run()
}
