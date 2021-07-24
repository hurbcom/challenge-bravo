package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
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

	if error := services.CreateCurrency(&currency); error != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": error.Error()})
		return
	}

	c.IndentedJSON(http.StatusCreated, currency)
}

// Handle of request to convert two currencies
func ConvertCurrency(c *gin.Context) {
	var conversion models.Conversion

	if error := c.ShouldBindUri(&conversion); error != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": error.Error()})
		return
	}
	
	result, error := services.ConvertCurrency(&conversion)
	if error != nil {
		c.IndentedJSON(http.StatusBadRequest,gin.H{"error": error.Error()})
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{"result": result})
}

// Handle of request to delete a currency
func DeleteCurrency(c *gin.Context) {
	var currency models.Currency

	if error := c.ShouldBindUri(&currency); error != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": error.Error()})
		return
	}

	error := services.DeleteCurrency(&currency)
	if error != nil {
		c.IndentedJSON(http.StatusBadRequest,gin.H{"error": error.Error()})
		return
	}

	c.IndentedJSON(http.StatusNoContent, nil)
}
