package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/hurbcom/challenge-bravo/dao"
	"github.com/hurbcom/challenge-bravo/models"
	"github.com/hurbcom/challenge-bravo/services"
)

//GetCoin List all Coins avalable
// @Tags coin
// @Summary  Index coin
// @Description Return all the coin on the pool of avalable coins
// @Produce json
// @Success 200 {array} models.Coin
// @Failure 404 {object} models.DefaultError
// @Router /coin [get]
func GetCoin(c *gin.Context) {
	result, err := dao.GetSuportedCoins()
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"errors": []string{err.Error()}})
		c.Abort()
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": result})
	return
}

//CreateCoin Create a Coin in the pool
// @Tags coin
// @Summary  Index coin
// @Description Create a Coin in the pool
// @Accept json
// @Produce json
// @param Request body models.Coin true "Request Body"
// @Success 200 {object} models.Coin
// @Failure 400 {object} models.DefaultError
// @Router /coin [POST]
func CreateCoin(c *gin.Context) {
	var newCoin models.Coin
	var response *models.Coin
	var err error
	if err := c.ShouldBindJSON(&newCoin); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"errors": []string{err.Error()}})
		c.Abort()
		return
	}

	if response, err = services.CreateCoin(newCoin); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"errors": []string{err.Error()}})
		c.Abort()
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": *response})
	return

}

//CreateCoin Delete a Coin in the pool
// @Tags coin
// @Summary  Index coin
// @Description Delete a Coin in the pool
// @Accept json
// @Produce json
// @param Request path string true "Request symbol"
// @Success 200 {object} models.Coin
// @Failure 400 {object} models.DefaultError
// @Router /coin [DELETE]
func DeleteCoin(c *gin.Context) {
	var delCoin models.Coin
	delCoin.Symbol = c.Params.ByName("symbol")
	if delCoin.Symbol == "" {
		c.JSON(http.StatusBadRequest, gin.H{"errors": []string{"need a symbol"}})
		c.Abort()
		return
	}
	if err := dao.DeleteCoin(delCoin); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"errors": []string{err.Error()}})
		c.Abort()
		return
	}
	c.JSON(http.StatusOK, gin.H{"Deleted": delCoin})
	return
}
