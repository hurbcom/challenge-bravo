package controllers

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"net/url"
	"os"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/hurbcom/challenge-bravo/models"
)

// Conversion Get/price-conversion
// @Tags Conversion
// @Summary Index Conversion
// @Description Convert a amount of a coin into other
// @Produce json
// @Param  from query string true "Original symbol"
// @Param  to query string true "Destiny symbol"
// @Param  amount query string true "Amount to convert"
// @Success 200 {object} models.CoinExchange
func Conversion(c *gin.Context) {
	var coin models.CoinExchange
	var result models.Response
	from := c.DefaultQuery("from", "")
	to := c.DefaultQuery("to", "")
	amount := c.DefaultQuery("amount", "")

	if from == "" || to == "" || amount == "" {
		c.JSON(http.StatusBadRequest, gin.H{"errors": []string{"Some value is missing"}})
		c.Abort()
		return
	}
	s, err := strconv.ParseFloat(amount, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"errors": []string{"Amount is invalid"}})
		c.Abort()
		return
	}

	coin.From = strings.ToUpper(from)
	coin.To = strings.ToUpper(to)
	coin.Amount = s

	if err := coin.ValidateCoin(); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"errors": []string{"Coin not suported"}})
		c.Abort()
		return
	}

	if s > 0.00 {
		client := &http.Client{}
		req, err := http.NewRequest("GET", "https://pro-api.coinmarketcap.com/v1/tools/price-conversion", nil)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"errors": []string{"OOPS something is wrong"}})
			c.Abort()
			return
		}
		q := url.Values{}
		q.Add("symbol", coin.From)
		q.Add("convert", coin.To)
		q.Add("amount", amount)

		req.Header.Set("Accepts", "application/json")
		req.Header.Add("X-CMC_PRO_API_KEY", os.Getenv("EXTERNAL_API_KEY"))
		req.URL.RawQuery = q.Encode()

		resp, err := client.Do(req)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"errors": []string{"OOPS request error'"}})
			c.Abort()
			return
		}
		if resp.StatusCode == http.StatusOK {
			defer resp.Body.Close()
			respBody, _ := ioutil.ReadAll(resp.Body)
			json.Unmarshal(respBody, &result)
			coin.Priceconversion = result.Data.Quote
			c.JSON(http.StatusOK, gin.H{"data": coin})
			return
		}
	}
	c.JSON(http.StatusOK, gin.H{"data": coin})
	return
}

// CreateCoin Post/coin
// @Tags Coin
// @Summary add a coin into the poll
// @Description Create a new coin
// @Accept json
// @Produce json
// @param Request body models.Coin true "Request body"
// @Success 200 {object} models.Coin
// @Router /coin [POST]
func CreateCoin(c *gin.Context) {
	var newCoin models.Coin
	var verify models.VerifyCoin

	c.ShouldBindJSON(&newCoin)

	if newCoin.StoreContains() {
		c.JSON(http.StatusOK, gin.H{"data": newCoin})
		return
	}

	client := &http.Client{}
	req, err := http.NewRequest("GET", "https://pro-api.coinmarketcap.com/v1/cryptocurrency/map", nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"errors": []string{"OOPS request error'"}})
		c.Abort()
		return
	}

	q := url.Values{}
	q.Add("symbol", strings.ToUpper(newCoin.Symbol))

	req.Header.Set("Accepts", "application/json")
	req.Header.Add("X-CMC_PRO_API_KEY", os.Getenv("EXTERNAL_API_KEY"))
	req.URL.RawQuery = q.Encode()

	resp, err := client.Do(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"errors": []string{"OOPS request error"}})
		c.Abort()
		return
	}

	if resp.StatusCode == http.StatusOK {
		defer resp.Body.Close()
		respBody, _ := ioutil.ReadAll(resp.Body)
		json.Unmarshal(respBody, &verify)
		if verify.Status.ErrorCode == 0 {
			newCoin.AddCoin()
			c.JSON(http.StatusOK, gin.H{"data": newCoin})
			return
		}
		c.JSON(http.StatusBadRequest, gin.H{"errors": []string{"May this Symbol does not exist"}})
		c.Abort()
		return
	}
	c.JSON(http.StatusInternalServerError, gin.H{"errors": []string{"OOPS request error"}})
	c.Abort()
	return
}

// CreateCoin Delete/coin
// @Tags Coin
// @Summary Deleta a coin from the pool
// @Description Convert a amount of a coin into other
// @Produce json
// @Param  symbol query string true "symbol to delete"
// @Success 200 {object} models.CoinExchange models.Quote
// @Router /coin [DELETE]
func DeleteCoin(c *gin.Context) {
	var removedCoin models.Coin
	removedCoin.Symbol = strings.ToUpper(c.Params.ByName("symbol"))
	if err := removedCoin.DeleteCoin(); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"errors": []string{err.Error()}})
		c.Abort()
		return
	}
	c.JSON(http.StatusOK, gin.H{"deleted": removedCoin})
	return
}

func GetCoin(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"data": models.GetSuportedCoins()})
	return
}
