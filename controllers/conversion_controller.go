package controllers

import (
	"strconv"

	"github.com/felipepnascimento/challenge-bravo-flp/models"
	"github.com/gin-gonic/gin"
)

func Convert(c *gin.Context) {
	from := c.Query("from")
	to := c.Query("to")
	a, _ := strconv.ParseFloat(c.Query("amount"), 32)
	var amount = float32(a)

	var conversion = models.Conversion{
		From:   from,
		To:     to,
		Amount: amount,
		Result: amount * 2,
	}
	c.JSON(200, conversion)
}
