package dao

import (
	"errors"
	"strings"
	"time"

	"github.com/allegro/bigcache"
	"github.com/hurbcom/challenge-bravo/models"
	"github.com/hurbcom/challenge-bravo/utils"
)

//SuportedCoins pool of the coins available
var SuportedCoins []string

//cache small cache for load the prices
var cache *bigcache.BigCache

//cacheCoinsOK trustable cache for store coins
var cacheCoinsOK *bigcache.BigCache

func init() {
	cache, _ = bigcache.NewBigCache(bigcache.DefaultConfig(5 * time.Minute))
	cacheCoinsOK, _ = bigcache.NewBigCache(bigcache.DefaultConfig(5 * time.Hour))
	for _, str := range SuportedCoins {
		SetCoinExist(str, "ok")
	}
}

//CreteCoin this Create a coin in the pool
func CreteCoin(c models.Coin) {
	SuportedCoins = append(SuportedCoins, strings.ToUpper(c.Symbol))
	return
}

//StoreContains this verify if the pool conteins the coin
func StoreContains(c models.Coin) bool {
	return utils.Contains(SuportedCoins, strings.ToUpper(c.Symbol))
}

//DeleteCoin remove the coin from the pool
func DeleteCoin(c models.Coin) error {
	c.Symbol = strings.ToUpper(c.Symbol)
	if len(SuportedCoins) > 0 {
		if utils.Contains(SuportedCoins, strings.ToUpper(c.Symbol)) {
			for i, val := range SuportedCoins {
				if strings.ToUpper(c.Symbol) == val {
					utils.RemoveCopy(SuportedCoins, i)
					return nil
				}
			}
		}
		return errors.New("Is not possible delete this coin")
	}
	return nil
}

//GetSuportedCoins return the suported coins
func GetSuportedCoins() ([]models.Coin, error) {
	if len(SuportedCoins) > 0 {
		vet := []models.Coin{}
		for _, val := range SuportedCoins {
			vet = append(vet, models.Coin{Symbol: val})
		}
		return vet, nil
	}
	return nil, errors.New("the coins is empty")
}

//ValidateCoinExchange Validate if the from and to coins are in the pool
func ValidateCoinExchange(c models.CoinExchange) error {
	if ok := utils.Contains(SuportedCoins, c.From); !ok {
		return errors.New("Coin not suported")
	}
	parsedto := strings.Split(c.To, ",")
	for _, str := range parsedto {
		ok := utils.Contains(SuportedCoins, str)
		if !ok {
			return errors.New("Coin not suported")
		}
	}
	return nil
}

//CreateCacheCoinValues add the price of the respective coin in the cache of 5 minutes
func CreateCacheCoinValues(c models.Coin, value string) {
	if c.Symbol != "USD" {
		cache.Set(c.Symbol, []byte(value))
	}
	return
}

//GetCoinValue read if the cache find the values in the cache
func GetCoinValue(c models.Coin) (string, error) {
	if c.Symbol == "USD" {
		return "1.00", nil
	}
	val, err := cache.Get(c.Symbol)
	if err != nil {
		return "", err
	}
	return string(val), nil
}

//SetCoinExist set the coin in the trustable cache
func SetCoinExist(symbol string, value string) {
	cacheCoinsOK.Set("symbol", []byte(value))
}

//GetCoinExist get the coin if it is on the tustable cache
func GetCoinExist(symbol string) (string, error) {
	val, err := cacheCoinsOK.Get(symbol)
	if err != nil {
		return "", err
	}
	return string(val), nil
}
