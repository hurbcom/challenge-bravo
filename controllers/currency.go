package controllers

import (
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/gustavowiller/challengebravo/database"
	"github.com/gustavowiller/challengebravo/models"
	"github.com/gustavowiller/challengebravo/services"
)

// Handle of request create the new currency
func CreateCurrency(c *gin.Context) {
	var currency models.Currency

	if err := c.ShouldBindJSON(&currency); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if error := models.ValidateStoreCurrency(&currency); error != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": error.Error()})
		return
	}

	if currency.IsReal == true {
		exchangeRates, error := services.AllExchangeRates()
		if error != nil {
			c.IndentedJSON(http.StatusInternalServerError, nil)
			return
		}

		exchangeRate, found := exchangeRates[currency.Code]
		if !found {
			c.IndentedJSON(
				http.StatusBadRequest,
				gin.H{"error": "No real value exchange rate found for this currency"})

			return
		}

		rate, error := strconv.ParseFloat(exchangeRate, 64)
		if error != nil {
			log.Printf(error.Error())
			c.IndentedJSON(http.StatusInternalServerError, nil)
			return
		}

		currency.ExchangeRate = rate
	}

	database := database.Connect()
	sqlDB, _ := database.DB()
	defer sqlDB.Close()

	if error := database.Create(&currency).Error; error != nil {
		log.Printf(error.Error())
		c.IndentedJSON(http.StatusInternalServerError, nil)
		return
	}

	c.IndentedJSON(http.StatusCreated, currency)
}

// Handle of request to convert two currencies
func ConvertCurrency(c *gin.Context) {
	var conversion models.Conversion
	var currencyFrom models.Currency
	var currencyTo models.Currency

	if error := c.ShouldBindUri(&conversion); error != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": error.Error()})
		return
	}

	database := database.Connect()
	sqlDB, _ := database.DB()
	defer sqlDB.Close()

	if error := database.Where("code = ?", conversion.From).First(&currencyFrom).Error; error != nil {
		c.IndentedJSON(
			http.StatusBadRequest,
			gin.H{
				"error": fmt.Sprintf("The code currency '%s' not found", conversion.From)})
		return
	}

	if error := database.Where("code = ?", conversion.To).First(&currencyTo).Error; error != nil {
		c.IndentedJSON(
			http.StatusBadRequest,
			gin.H{
				"error": fmt.Sprintf("The code currency '%s' not found", conversion.To)})
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{
		"result": conversion.Amount * currencyTo.ExchangeRate / currencyFrom.ExchangeRate})
}

// Handle of request to delete a currency
func DeleteCurrency(c *gin.Context) {
	var currency models.Currency

	if error := c.ShouldBindUri(&currency); error != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": error.Error()})
		return
	}

	database := database.Connect()
	sqlDB, _ := database.DB()
	defer sqlDB.Close()

	if error := database.Where("code = ?", currency.Code).First(&currency).Error; error != nil {
		c.IndentedJSON(
			http.StatusBadRequest,
			gin.H{
				"error": fmt.Sprintf("The code currency '%s' not found", currency.Code)})
		return
	}

	database.Where("code = ?", currency.Code).Delete(&models.Currency{})

	c.IndentedJSON(http.StatusNoContent, nil)
}
