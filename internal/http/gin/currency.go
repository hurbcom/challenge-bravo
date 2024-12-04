package gin

import (
	"log"
	"net/http"

	"github.com/danielmalka/challenge-bravo/application/currency"
	"github.com/gin-gonic/gin"
)

// listCurrency godoc
// @Summary List currencies
// @Schemes
// @Description Show all currencies
// @Tags currency
// @Produce json
// @Success 200 {array} currency.Currency
// @Failure 500 {object} gin.Message
// @Router /v1/currency [get]
func listCurrency(service *currency.Service, response Message) gin.HandlerFunc {
	currencies, err := service.List()
	if err != nil {
		log.Println("error listing currencies: ", err)
		response.StatusCode = http.StatusInternalServerError
		response.Message = gin.H{ERROR_STR: err.Error()}
		return func(c *gin.Context) {
			c.JSON(response.StatusCode, response.Message)
		}
	}

	return func(c *gin.Context) {
		response.StatusCode = http.StatusOK
		c.JSON(response.StatusCode, currencies)
	}
}

// createCurrency godoc
// @Summary Create Currency
// @Schemes
// @Description Create a new Currency
// @Tags currency
// @Accept json
// @Param request body currency.CreateData true "Currency Payload"
// @Produce json
// @Success 200 {object} currency.Currency
// @Failure 400 {object} gin.Message
// @Failure 500 {object} gin.Message
// @Router /v1/currency [post]
func createCurrency(service *currency.Service, response Message) gin.HandlerFunc {
	return func(c *gin.Context) {
		var request currency.CreateData
		if err := c.ShouldBindJSON(&request); err != nil {
			log.Println("error binding JSON: ", err)
			response.StatusCode = http.StatusBadRequest
			response.Message = gin.H{ERROR_STR: err.Error()}
			c.JSON(response.StatusCode, response.Message)
			return
		}

		currency, err := service.Create(&request)
		if err != nil {
			log.Println("error creating currency: ", err)
			response.StatusCode = http.StatusInternalServerError
			response.Message = gin.H{ERROR_STR: err.Error()}
			c.JSON(response.StatusCode, response.Message)
			return
		}

		response.StatusCode = http.StatusOK
		c.JSON(response.StatusCode, currency)
	}
}

// updateCurrency godoc
// @Summary Update Currency
// @Schemes
// @Description Update a Currency
// @Tags currency
// @Accept json
// @Param id path string true "ID of the Currency"
// @Param request body currency.UpdateData true "Currency Payload"
// @Produce json
// @Success 200 {object} currency.Currency
// @Failure 400 {object} gin.Message
// @Failure 500 {object} gin.Message
// @Router /v1/currency/{id} [put]
func updateCurrency(service *currency.Service, response Message) gin.HandlerFunc {
	return func(c *gin.Context) {
		log.Println("request: ", c.Request.URL.Query())
		var request currency.UpdateData
		if err := c.ShouldBindJSON(&request); err != nil {
			log.Println("error binding JSON: ", err)
			response.StatusCode = http.StatusBadRequest
			// make a better response message
			response.Message = gin.H{ERROR_STR: err.Error()}
			c.JSON(response.StatusCode, response.Message)
			return
		}
		request.ID = c.Param("id")

		currency, err := service.Update(&request)
		if err != nil {
			log.Println("error updating currency: ", err)
			response.StatusCode = http.StatusInternalServerError
			response.Message = gin.H{ERROR_STR: err.Error()}
			c.JSON(response.StatusCode, response.Message)
			return
		}

		response.StatusCode = http.StatusOK
		c.JSON(response.StatusCode, currency)
	}
}

// deleteCurrency godoc
// @Summary Delete Currency
// @Schemes
// @Description Delete a Currency
// @Tags currency
// @Accept json
// @Param id path string true "ID of the Currency"
// @Produce json
// @Success 200
// @Failure 500 {object} gin.Message
// @Router /v1/currency/{id} [delete]
func deleteCurrency(service *currency.Service, response Message) gin.HandlerFunc {
	return func(c *gin.Context) {
		currencyID := c.Param("id")

		err := service.Delete(currencyID)
		if err != nil {
			log.Println("error updating currency: ", err)
			response.StatusCode = http.StatusInternalServerError
			response.Message = gin.H{ERROR_STR: err.Error()}
			c.JSON(response.StatusCode, response.Message)
			return
		}

		response.StatusCode = http.StatusOK
		c.JSON(response.StatusCode, gin.H{})
	}
}
