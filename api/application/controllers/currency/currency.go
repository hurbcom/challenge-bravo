package currency

import (
	"clevergo.tech/jsend"
	"encoding/json"
	"github.com/gin-gonic/gin"
	"github.com/iiurydias/challenge-bravo/api/application/client"
	log "github.com/sirupsen/logrus"
	"io/ioutil"
	"net/http"
)

type Currency struct {
	grpcClient client.Client
}

type AddCurrency struct {
	Code string `json:"code"`
}

func New(grpcClient client.Client) *Currency {
	return &Currency{grpcClient: grpcClient}
}

func (c *Currency) AddCurrencyHandler(ctx *gin.Context) {
	body, err := ioutil.ReadAll(ctx.Request.Body)
	if err != nil {
		if err := jsend.Error(ctx.Writer, "data has been lost on server", http.StatusInternalServerError); err != nil {
			log.Errorln(err)
		}
		return
	}
	var addCurrency AddCurrency
	if err := json.Unmarshal(body, &addCurrency); err != nil {
		if _, ok := err.(*json.UnmarshalTypeError); ok {
			if err := jsend.Fail(ctx.Writer, AddCurrency{Code: "code has a invalid type"}, http.StatusBadRequest); err != nil {
				log.Errorln(err)
			}
			return
		}
		log.Errorln(err)
		if err := jsend.Error(ctx.Writer, "data has been lost on server", http.StatusInternalServerError); err != nil {
			log.Errorln(err)
		}
		return
	}
	if addCurrency.Code == "" {
		if err := jsend.Fail(ctx.Writer, AddCurrency{Code: "code is a required field"}, http.StatusBadRequest); err != nil {
			log.Errorln(err)
		}
		return
	}
	if err := c.grpcClient.AddCurrency(addCurrency.Code); err != nil {
		log.Errorln(err)
		if err := jsend.Error(ctx.Writer, "data has been lost on server", http.StatusInternalServerError); err != nil {
			log.Errorln(err)
		}
		return
	}
	if err = jsend.Success(ctx.Writer, addCurrency, http.StatusCreated); err != nil {
		log.Errorln(err)
	}
}
