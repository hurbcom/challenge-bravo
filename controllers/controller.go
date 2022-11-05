package controllers

import (
	"net/http"
	"strconv"

	"github.com/felipepnascimento/challenge-bravo-flp/database"
	"github.com/felipepnascimento/challenge-bravo-flp/models"
	"github.com/felipepnascimento/challenge-bravo-flp/services"
	"github.com/gin-gonic/gin"
)

func ListCurrencies(c *gin.Context) {
	var currencies []models.Currency
	database.DB.Find(&currencies)
	c.JSON(200, currencies)
}

func CreateCurrency(c *gin.Context) {
	// TODO Colocar validações no model
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

func DeleteCurrency(c *gin.Context) {
	var currency models.Currency
	id := c.Params.ByName("id")
	database.DB.Delete(&currency, id)
	c.JSON(http.StatusOK, gin.H{"data": "Currency successfully deleted"})
}

func GetConvertParams(c *gin.Context) (string, string, float32) {
	from := c.Query("from")
	to := c.Query("to")
	a, _ := strconv.ParseFloat(c.Query("amount"), 32)
	amount := float32(a)

	return from, to, amount
}

func GetCurrencyByKey(key string) models.Currency {
	var currency models.Currency
	database.DB.Where("key = ?", key).First(&currency)

	return currency
}

func ConvertCurrency(c *gin.Context) {
	from, to, amount := GetConvertParams(c)

	if from == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"Bad Request": "From parameter is required"})
		return
	}

	if to == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"Bad Request": "To parameter is required"})
		return
	}

	if amount == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"Bad Request": "Amount parameter is required"})
		return
	}

	fromCurrency := GetCurrencyByKey(from)
	toCurrency := GetCurrencyByKey(to)

	if fromCurrency.ID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"Bad Request": "From currency does not exists or is not available to conversion"})
		return
	}

	if toCurrency.ID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"Bad Request": "To currency does not exists or is not available to conversion"})
		return
	}

	quote := services.LayerApiGetRate(to)

	var conversion = models.Conversion{
		From:   from,
		To:     to,
		Amount: amount,
		Result: amount * quote,
	}
	c.JSON(200, conversion)
}
