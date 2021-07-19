package controllers

import (
	"net/http"
	"strconv"

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
	var currencyFrom models.Currency
	var currencyTo models.Currency

	amount, _ := strconv.ParseFloat(c.Param("amount"), 64)

	database := database.Connect()
	sqlDB, _ := database.DB()
	defer sqlDB.Close()

	database.Where("code = ?", c.Param("from")).First(&currencyFrom)
	database.Where("code = ?", c.Param("to")).First(&currencyTo)
	
	c.IndentedJSON(http.StatusOK, gin.H{
		"result": amount * currencyTo.ExchangeRate / currencyFrom.ExchangeRate})
}

func DeleteCurrency(c *gin.Context) {
	database := database.Connect()
	sqlDB, _ := database.DB()
	defer sqlDB.Close()

	database.Where("code = ?", c.Param("code")).Delete(&models.Currency{})

	c.IndentedJSON(http.StatusOK, nil)
}