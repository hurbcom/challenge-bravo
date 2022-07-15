package handle

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	"github.com/Pedro-Pessoa/challenge-bravo/externalapis/abstract"
	"github.com/Pedro-Pessoa/challenge-bravo/pkg/cache"
	"github.com/Pedro-Pessoa/challenge-bravo/pkg/monetary"
	"github.com/Pedro-Pessoa/challenge-bravo/pkg/web/rest/apierror"
	"github.com/Pedro-Pessoa/challenge-bravo/pkg/web/rest/apimodels"
	"github.com/Pedro-Pessoa/challenge-bravo/pkg/web/service/workers"
	"github.com/jmoiron/sqlx"
	"go.uber.org/zap"
)

// Convert returns a convertion between two currencies
// @Summary      	Convert
// @Description  	Converts between two currencies.
// @Produce      	json
// @Param        	from   query  string  true  "base currency to be converted from"
// @Param        	to   query  string  true  "target currency to be converted to"
// @Param        	amount   query  float64  true  "amount of money to convert"
// @Success      	200  {object}  swaggomodels.APIValidResponseMock{response=apimodels.Convertion}
// @Failure      	400  {object}  swaggomodels.APIFailResponseMock{response=apimodels.None} "bad request"
// @Failure      	500  {object}  swaggomodels.APIFailResponseMock{response=apimodels.None} "internal server error"
// @Router       	/api/v0/currencies/convert [get]
func Convert(db *sqlx.DB, s *cache.Store[string, *abstract.LiveResponse], apiKey string) func(http.ResponseWriter, *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		query := r.URL.Query()

		from := strings.ToUpper(query.Get("from"))
		to := strings.ToUpper(query.Get("to"))
		amount := query.Get("amount")

		if from == "" || to == "" || amount == "" {
			apimodels.SendJSON(w, http.StatusBadRequest, apimodels.APIResponse[apimodels.None]{
				Error: apierror.ErrMissingRequiredField.Ptr(),
			})
			return
		}

		if !monetary.IsCodeValid(from) || !monetary.IsCodeValid(to) {
			apimodels.SendJSON(w, http.StatusBadRequest, apimodels.APIResponse[apimodels.None]{
				Error: apierror.ErrInvalidCurrency.Ptr(),
			})
			return
		}

		_, err := strconv.ParseFloat(amount, 64)
		if err != nil {
			apimodels.SendJSON(w, http.StatusBadRequest, apimodels.APIResponse[apimodels.None]{
				Error: apierror.ErrInvalidAmount.WithRawErr(err).Ptr(),
			})
			return
		}

		if from == to {
			apimodels.SendJSON(w,
				http.StatusOK,
				apimodels.APIResponse[apimodels.Convertion]{
					Response: apimodels.Convertion{
						From:   from,
						To:     to,
						Amount: json.Number(amount),
						Result: json.Number("1"),
					},
				},
			)
			return
		}

		var currencies []monetary.Currency
		err = db.Select(&currencies, "SELECT * FROM currency WHERE code=$1 OR code=$2", from, to)
		if err != nil {
			zap.L().Error("failed to select from db on handle.convert", zap.Error(err))
			apimodels.SendJSON(w, http.StatusInternalServerError, apimodels.APIResponse[apimodels.None]{
				Error: apierror.ErrDatabaseFailed.WithRawErr(err).Ptr(),
			})
			return
		}

		if len(currencies) < 2 {
			apimodels.SendJSON(w, http.StatusNotFound, apimodels.APIResponse[apimodels.None]{
				Error: apierror.ErrCurrencyNotFound.WithMessage(from + " or " + to + " not found in the database").Ptr(),
			})
			return
		}

		var fromCurrency, toCurrency monetary.Currency

		if currencies[0].Code == from {
			fromCurrency = currencies[0]
			toCurrency = currencies[1]
		} else {
			fromCurrency = currencies[1]
			toCurrency = currencies[0]
		}

		split := strings.Split(amount, ".")
		intPart := amount
		decimalPart := "0"

		if len(split) == 2 {
			intPart = split[0]
			decimalPart = split[1]
		}

		fromMoney, err := monetary.NewFromString(intPart, decimalPart, fromCurrency)
		if err != nil {
			zap.L().Error("failed to make money on handle.convert", zap.Error(err))
			apimodels.SendJSON(w, http.StatusInternalServerError, apimodels.APIResponse[apimodels.None]{
				Error: apierror.ErrMonetaryFailed.WithRawErr(err).Ptr(),
			})
			return
		}

		var val string

		switch {
		case fromMoney.Currency().Standard == monetary.CurrencyStandardFictitious ||
			toCurrency.Standard == monetary.CurrencyStandardFictitious:
			val, err = workers.ConvertFictitious(fromMoney, toCurrency, s, apiKey)
		default:
			val, err = workers.ConvertReal(fromMoney, toCurrency, s, apiKey)
		}

		if err != nil {
			zap.L().Error("failed to convert request on handle.convert", zap.Error(err))
			apimodels.SendJSON(w, http.StatusInternalServerError, apimodels.APIResponse[apimodels.None]{
				Error: apierror.ErrConvertionFailed.WithRawErr(err).Ptr(),
			})
			return
		}

		apimodels.SendJSON(w, http.StatusOK, apimodels.APIResponse[apimodels.Convertion]{
			Response: apimodels.Convertion{
				From:   from,
				To:     to,
				Amount: json.Number(amount),
				Result: json.Number(val),
			},
		})
	}
}
