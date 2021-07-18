package main

import (
	"net/http"
	"strconv"

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
	router.GET("/currency/convert/:from/:to/:amount", convertCurrency)
	router.DELETE("/currency/:code", deleteCurrency)

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

func convertCurrency(c *gin.Context) {
	amount, _ := strconv.ParseFloat(c.Param("amount"), 64)
	result :=
		amount *
		database.GetExchangeRate(c.Param("to")) /
		database.GetExchangeRate(c.Param("from"));
	
	c.IndentedJSON(http.StatusOK, gin.H{"result": result})
}

func deleteCurrency(c *gin.Context) {
	database.DeleteCurrency(c.Param("code"))

	c.IndentedJSON(http.StatusOK, nil)
}