package handlers

import (
	"clevergo.tech/jsend"
	"github.com/gin-gonic/gin"
	"github.com/iiurydias/challenge-bravo/api/application/controller"
	"net/http"
	"strconv"
	"strings"
)

type convertion struct {
	From   string  `json:"from,omitempty"`
	To     string  `json:"to,omitempty"`
	Amount string  `json:"amount,omitempty"`
	Result float64 `json:"result,omitempty"`
}

// IT HANDLES A CONVERT CURRENCIES REQUEST
func (h *handlers) ConvertCurrency() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		from := strings.ToUpper(ctx.Query("from"))
		if from == "" {
			logError(jsend.Fail(ctx.Writer, convertion{From: "from is a required field"}, http.StatusBadRequest))
			return
		}
		to := strings.ToUpper(ctx.Query("to"))
		if to == "" {
			logError(jsend.Fail(ctx.Writer, convertion{To: "to is a required field"}, http.StatusBadRequest))
			return
		}
		amount := ctx.Query("amount")
		if amount == "" {
			logError(jsend.Fail(ctx.Writer, convertion{Amount: "amount is a required field"}, http.StatusBadRequest))
			return
		}
		typedAmount, err := strconv.ParseFloat(amount, 64)
		if err != nil {
			logError(jsend.Fail(ctx.Writer, convertion{Amount: "amount is invalid"}, http.StatusBadRequest))
			return
		}
		conversionResult, err := h.controller.ConvertCurrency(from, to, typedAmount)
		if err != nil {
			if err == controller.ErrFromCurrencyNotFound {
				logError(jsend.Fail(ctx.Writer, convertion{From: "from currency not found"}, http.StatusNotFound))
				return
			}
			if err == controller.ErrToCurrencyNotFound {
				logError(jsend.Fail(ctx.Writer, convertion{To: "to currency not found"}, http.StatusNotFound))
				return
			}
			logError(err)
			logError(jsend.Error(ctx.Writer, "data has been lost on server", http.StatusInternalServerError))
			return
		}
		logError(jsend.Success(ctx.Writer, convertion{
			From:   from,
			To:     to,
			Amount: amount,
			Result: conversionResult,
		}, http.StatusOK))
	}
}
