package main

import (
	"testing"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/hurbcom/challenge-bravo/controllers"
	"github.com/hurbcom/challenge-bravo/dao"
	"github.com/subosito/gotenv"
)

func TestMain(m *testing.M) {
	gotenv.Load()
	dao.SuportedCoins = []string{"USD", "BRL", "EUR", "BTC", "ETH"}
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

	m.Run()
}

//TODO:Integrations test and the bench mark
func Test_Conversor(t *testing.T) {
	tests := []struct {
		name string
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			main()
		})
	}
}
