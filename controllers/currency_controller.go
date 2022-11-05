package controllers

import (
	"net/http"
	"strconv"

	"github.com/felipepnascimento/challenge-bravo-flp/database"
	"github.com/felipepnascimento/challenge-bravo-flp/models"
	"github.com/gin-gonic/gin"
)

func ListCurrencies(c *gin.Context) {
	var currencies []models.Currency
	database.DB.Find(&currencies)
	c.JSON(200, currencies)
}

func CreateCurrency(c *gin.Context) {
	var currency models.Currency
	if err := c.ShouldBindJSON(&currency); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error()})
		return
	}
	database.DB.Create(&currency)
	c.JSON(http.StatusOK, currency)
}

func ShowCurrency(c *gin.Context) {
	var currency models.Currency
	id := c.Params.ByName("id")
	database.DB.First(&currency, id)

	if currency.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{
			"Not found": "Currency not found"})
		return
	}

	c.JSON(http.StatusOK, currency)
}

func ConvertCurrency(c *gin.Context) {
	from := c.Query("from")
	to := c.Query("to")
	a, _ := strconv.ParseFloat(c.Query("amount"), 32)
	var amount = float32(a)

	var conversion = models.Conversion{
		From:   from,
		To:     to,
		Amount: amount,
		Result: amount * 2,
	}
	c.JSON(200, conversion)
}
