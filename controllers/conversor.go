package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/hurbcom/challenge-bravo/models"
	"github.com/hurbcom/challenge-bravo/services"
)

//CreateCoin Delete a Coin in the pool
// @Tags Conversor
// @Summary  Index Conversor
// @Description Convert an amount of one cryptocurrency or fiat currency into one different currencies
// @Accept json
// @Produce json
// @param from query string true "Request from"
// @param to query string true "Request to"
// @param amount query number true "Request amount"
// @Success 200 {object} models.CoinExchange
// @Failure 400 {object} models.DefaultError
// @Router /price-conversion [GET]
func Conversor(c *gin.Context) {
	var coin models.CoinExchange
	var err error
	coin.From = c.DefaultQuery("from", "")
	coin.To = c.DefaultQuery("to", "")
	amt := c.DefaultQuery("amount", "")

	if amt == "" || coin.From == "" || coin.To == "" {
		c.JSON(http.StatusBadRequest, gin.H{"erros": "Some value is missing"})
		c.Abort()
		return
	}

	coin.Amount, err = strconv.ParseFloat(amt, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erros": "amount is no a number"})
		c.Abort()
		return
	}

	coin.AmountConveted, err = services.Convert(coin)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"errors": err.Error()})
		c.Abort()
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": coin})
	return
}
