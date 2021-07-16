package main

import (
	"net/http"

	"github.com/gustavowiller/challengebravo/database"
	"github.com/gin-gonic/gin"
)

func main() {
	database.RunMigrations()
	startRouter()
}

func startRouter() {
	router := gin.Default()
	router.POST("/currency", createCurrency)

	router.Run("localhost:8080")
}

func createCurrency(c *gin.Context) {
	var currency database.Currency

	if err := c.ShouldBindJSON(&currency); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if currency.Code == "" {
		c.IndentedJSON(http.StatusBadRequest, nil)
		return
	}

	database.StoreCurrency(&currency)

	c.IndentedJSON(http.StatusCreated, nil)
}