package controllers

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"net/url"
	"os"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/hurbcom/challenge-bravo/models"
)

func Exchange(c *gin.Context) {
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
		c.JSON(http.StatusInternalServerError, gin.H{"errors": []string{"OOPS something is wrong"}})
		c.Abort()
		return
	}

	coin.From = from
	coin.To = to
	coin.Amount = s

	if err := coin.ValidateAmount(); err != nil {
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
		q.Add("symbol", from)
		q.Add("amount", amount)
		q.Add("convert", to)

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

func CreateCoin(c *gin.Context) {

	return
}
