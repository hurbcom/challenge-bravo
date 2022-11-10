package controllers

import (
	"net/http"
	"strconv"

	"github.com/felipepnascimento/challenge-bravo-flp/models"
	usecases "github.com/felipepnascimento/challenge-bravo-flp/usecases"
	"github.com/gin-gonic/gin"
)

type currencyController struct {
	currencyUsecase usecases.CurrencyUsecase
}

type CurrencyController interface {
	CreateCurrency(c *gin.Context)
	GetAllCurrencies(c *gin.Context)
	GetCurrencyById(c *gin.Context)
	DeleteCurrency(c *gin.Context)
}

func InitializeCurrencyController(usecase usecases.CurrencyUsecase) CurrencyController {
	return &currencyController{usecase}
}

func (controller *currencyController) CreateCurrency(c *gin.Context) {
	var currency models.Currency

	if err := c.ShouldBindJSON(&currency); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := controller.currencyUsecase.CreateCurrency(&currency)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, currency)
}

func (controller *currencyController) GetAllCurrencies(c *gin.Context) {
	currencies, err := controller.currencyUsecase.GetAllCurrencies()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, currencies)
}

func (controller *currencyController) GetCurrencyById(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))

	currency, _ := controller.currencyUsecase.GetCurrencyById(id)

	if currency == nil {
		c.JSON(http.StatusNotFound, gin.H{"Not found": "Currency not found"})
		return
	}

	c.JSON(http.StatusOK, currency)
}

func (controller *currencyController) DeleteCurrency(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))

	err := controller.currencyUsecase.DeleteCurrency(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": "Currency successfully deleted"})
}
