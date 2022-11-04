package main

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/felipepnascimento/api-go-gin/controllers"
	"github.com/felipepnascimento/api-go-gin/database"
	"github.com/felipepnascimento/api-go-gin/models"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

var ID int

func SetupTestsRoutes() *gin.Engine {
	gin.SetMode(gin.ReleaseMode)
	rotas := gin.Default()
	return rotas
}

func CreateCurrencyMock() {
	currency := models.Currency{Key: "USD", Description: "USD", Enabled: true}
	database.DB.Create(&currency)
	ID = int(currency.ID)
}

func DeleteCurrencyMock() {
	var currency models.Currency
	database.DB.Delete(&currency, ID)
}

func TestListCurrencies(t *testing.T) {
	database.ConectaComBancoDeDados()
	CreateCurrencyMock()
	defer DeleteCurrencyMock()
	r := SetupTestsRoutes()
	r.GET("/currency", controllers.ListCurrencies)
	req, _ := http.NewRequest("GET", "/currency", nil)
	resposta := httptest.NewRecorder()
	r.ServeHTTP(resposta, req)
	assert.Equal(t, http.StatusOK, resposta.Code)
}
