package handlers

import (
	"net/http"
	"strconv"

	"github.com/felipepnascimento/challenge-bravo-flp/entities"
	usecases "github.com/felipepnascimento/challenge-bravo-flp/usecases"
	"github.com/gin-gonic/gin"
)

type currencyHandler struct {
	currencyUsecase usecases.CurrencyUsecase
}

type CurrencyHandler interface {
	CreateCurrency(c *gin.Context)
	GetAllCurrencies(c *gin.Context)
	GetCurrencyByID(c *gin.Context)
	DeleteCurrency(c *gin.Context)
}

func InitializeCurrencyHandler(usecase usecases.CurrencyUsecase) CurrencyHandler {
	return &currencyHandler{usecase}
}

func (handler *currencyHandler) CreateCurrency(c *gin.Context) {
	var currency entities.Currency

	if err := c.ShouldBindJSON(&currency); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := handler.currencyUsecase.CreateCurrency(&currency)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, currency)
}

func (handler *currencyHandler) GetAllCurrencies(c *gin.Context) {
	currencies, err := handler.currencyUsecase.GetAllCurrencies()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, currencies)
}

func (handler *currencyHandler) GetCurrencyByID(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))

	currency, _ := handler.currencyUsecase.GetCurrencyByID(id)

	if currency == nil {
		c.JSON(http.StatusNotFound, gin.H{"Not found": "Currency not found"})
		return
	}

	c.JSON(http.StatusOK, currency)
}

func (handler *currencyHandler) DeleteCurrency(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))

	err := handler.currencyUsecase.DeleteCurrency(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": "Currency successfully deleted"})
}
