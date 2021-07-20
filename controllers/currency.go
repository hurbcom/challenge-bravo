package controllers

import (
	"net/http"

	"github.com/gustavowiller/challengebravo/database"
	"github.com/gustavowiller/challengebravo/models"

	"github.com/gin-gonic/gin"
)

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

	database := database.Connect()
	sqlDB, _ := database.DB()
	defer sqlDB.Close()

	database.Create(&currency)

	c.IndentedJSON(http.StatusCreated, nil)
}

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

	database.Where("code = ?", conversion.From).First(&currencyFrom)
	database.Where("code = ?", conversion.To).First(&currencyTo)
	
	c.IndentedJSON(http.StatusOK, gin.H{
		"result": conversion.Amount * currencyTo.ExchangeRate / currencyFrom.ExchangeRate})
}

func DeleteCurrency(c *gin.Context) {
	var currency models.Currency

	if error := c.ShouldBindUri(&currency); error != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": error.Error()})
		return
	}

	database := database.Connect()
	sqlDB, _ := database.DB()
	defer sqlDB.Close()

	database.Where("code = ?", currency.Code).Delete(&models.Currency{})

	c.IndentedJSON(http.StatusOK, nil)
}