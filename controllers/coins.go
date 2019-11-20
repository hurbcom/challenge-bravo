package controllers

import (
	"net/http"
	"strconv"

	"github.com/challenge-bravo/models"
	"github.com/gin-gonic/gin"
)

func exchange(c *gin.Context) {
	var coin models.CoinExchange
	from := c.DefaultQuery("from", "")
	to := c.DefaultQuery("to", "")
	amount := c.DefaultQuery("amount", "")

	if from == "" || to == "" || amount == "" {
		c.JSON(http.StatusBadRequest, gin.H{"errors": []string{"Some value is missing"}})
		c.Abort()
		return
	}
	s, err := strconv.ParseFloat(amount, 64)
	coin.From = from
	coin.To = to
	coin.Amount = s

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"errors": "OOPS something is wrong"})
		c.Abort()
		return
	}
	if s > 0.00 {

	}
	coin.ExchangeAmount = 0
	c.JSON(http.StatusOK, gin.H{"data": coin})
	return

}
