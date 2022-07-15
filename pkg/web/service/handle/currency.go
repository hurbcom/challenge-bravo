package handle

import (
	"database/sql"
	"encoding/json"
	"errors"
	"net/http"

	"github.com/Pedro-Pessoa/challenge-bravo/pkg/monetary"
	"github.com/Pedro-Pessoa/challenge-bravo/pkg/web/rest/apierror"
	"github.com/Pedro-Pessoa/challenge-bravo/pkg/web/rest/apimodels"
	_ "github.com/Pedro-Pessoa/challenge-bravo/pkg/web/rest/swaggomodels" // swaggomodels needs to be imported for the documentation
	"github.com/go-chi/chi/v5"
	"github.com/jmoiron/sqlx"
	"github.com/mailru/easyjson"
	"go.uber.org/zap"
)

// CreateCurrency handles POST requests to the currency endpoint
// @Summary      	Create Currency
// @Description  	Creates a new currency.
// @Accept       	json
// @Produce      	json
// @Param        	payload body monetary.Currency true "payload"
// @Success      	200  {object}  swaggomodels.APIValidResponseMock{response=monetary.Currency}
// @Failure      	400  {object}  swaggomodels.APIFailResponseMock{response=apimodels.None} "bad request"
// @Failure      	500  {object}  swaggomodels.APIFailResponseMock{response=apimodels.None} "internal server error"
// @Router       	/api/v0/currencies [post]
func CreateCurrency(db *sqlx.DB) func(http.ResponseWriter, *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		var cur monetary.Currency
		err := easyjson.UnmarshalFromReader(r.Body, &cur)
		if err != nil {
			apimodels.SendJSON(w, http.StatusBadRequest, apimodels.APIResponse[apimodels.None]{
				Error: apierror.ErrInvalidCurrencyBody.WithRawErr(err).Ptr(),
			})
			return
		}

		if !monetary.IsCurrencyValid(cur) {
			apimodels.SendJSON(w, http.StatusBadRequest, apimodels.APIResponse[apimodels.None]{
				Error: apierror.ErrInvalidCurrencyBody.Ptr(),
			})
			return
		}

		tx, err := db.Begin()
		if err != nil {
			zap.L().Error("failed to start tx on createcurrency", zap.Error(err))
			apimodels.SendJSON(w, http.StatusInternalServerError, apimodels.APIResponse[apimodels.None]{
				Error: apierror.ErrDatabaseFailed.WithRawErr(err).Ptr(),
			})
			return
		}

		_, err = tx.Exec(`
		INSERT INTO currency
		VALUES($1, $2, $3, $4, $5, $6, $7)
		`, cur.Code, cur.MaxUnits, cur.ThousandsSplitter, cur.DecimalSplitter,
			cur.FixedExchangeRateIntPart, cur.FixedExchangeRateDecimalPart, cur.Standard)
		if err != nil {
			_ = tx.Rollback()
			zap.L().Error("failed to exec tc on createcurrency", zap.Error(err))
			apimodels.SendJSON(w, http.StatusInternalServerError, apimodels.APIResponse[apimodels.None]{
				Error: apierror.ErrDatabaseFailed.WithRawErr(err).Ptr(),
			})
			return
		}

		byts, err := easyjson.Marshal(cur)
		if err != nil {
			_ = tx.Rollback()
			zap.L().Error("failed marshal json on createcurrency", zap.Error(err))
			apimodels.SendJSON(w, http.StatusInternalServerError, apimodels.APIResponse[apimodels.None]{
				Error: apierror.ErrMarshalingFailed.WithRawErr(err).Ptr(),
			})
			return
		}

		err = tx.Commit()
		if err != nil {
			zap.L().Error("failed to commit tx on createcurrency", zap.Error(err))
			apimodels.SendJSON(w, http.StatusInternalServerError, apimodels.APIResponse[apimodels.None]{
				Error: apierror.ErrDatabaseFailed.WithRawErr(err).Ptr(),
			})
			return
		}

		apimodels.SendJSON(w, http.StatusOK, apimodels.APIResponse[json.RawMessage]{
			Response: byts,
		})
	}
}

// ReadCurrency handles GET requests to the currency endpoint
// @Summary      	Read Currency
// @Description  	Reads a currency
// @Produce      	json
// @Param        	currency_code   path  string  true  "Currency Code"
// @Success      	200  {object}  swaggomodels.APIValidResponseMock{response=monetary.Currency}
// @Failure      	400  {object}  swaggomodels.APIFailResponseMock{response=apimodels.None} "bad request"
// @Failure      	500  {object}  swaggomodels.APIFailResponseMock{response=apimodels.None} "internal server error"
// @Router       	/api/v0/currencies/{currency_code} [get]
func ReadCurrency(db *sqlx.DB) func(http.ResponseWriter, *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		code := chi.URLParam(r, "currency.code")
		if !monetary.IsCodeValid(code) {
			apimodels.SendJSON(w, http.StatusBadRequest, apimodels.APIResponse[apimodels.None]{
				Error: apierror.ErrInvalidCurrency.Ptr(),
			})
			return
		}

		var cur monetary.Currency
		err := db.Get(&cur, "SELECT * FROM currency WHERE code=$1", code)
		if err != nil {
			if errors.Is(err, sql.ErrNoRows) {
				apimodels.SendJSON(w, http.StatusNotFound, apimodels.APIResponse[apimodels.None]{
					Error: apierror.ErrCurrencyNotFound.Ptr(),
				})
				return
			}

			zap.L().Error("failed to get from db on readcurrency", zap.Error(err))
			apimodels.SendJSON(w, http.StatusInternalServerError, apimodels.APIResponse[apimodels.None]{
				Error: apierror.ErrDatabaseFailed.WithRawErr(err).Ptr(),
			})
			return
		}

		byts, err := easyjson.Marshal(cur)
		if err != nil {
			zap.L().Error("failed to marshal json on readcurrency", zap.Error(err))
			apimodels.SendJSON(w, http.StatusInternalServerError, apimodels.APIResponse[apimodels.None]{
				Error: apierror.ErrMarshalingFailed.WithRawErr(err).Ptr(),
			})
			return
		}

		apimodels.SendJSON(w, http.StatusOK, apimodels.APIResponse[json.RawMessage]{
			Response: byts,
		})
	}
}

// UpdateCurrency handles PATCH requests to the currency endpoint
// @Summary      	Update Currency
// @Description  	Updates a currency
// @Accept       	json
// @Produce      	json
// @Param        	payload body monetary.Currency true "payload"
// @Param        	currency_code   path  string  true  "Currency Code"
// @Success      	200  {object}  swaggomodels.APIValidResponseMock{response=monetary.Currency}
// @Failure      	400  {object}  swaggomodels.APIFailResponseMock{response=apimodels.None} "bad request"
// @Failure      	500  {object}  swaggomodels.APIFailResponseMock{response=apimodels.None} "internal server error"
// @Router       	/api/v0/currencies/{currency_code} [patch]
func UpdateCurrency(db *sqlx.DB) func(http.ResponseWriter, *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		code := chi.URLParam(r, "currency.code")
		if !monetary.IsCodeValid(code) {
			apimodels.SendJSON(w, http.StatusBadRequest, apimodels.APIResponse[apimodels.None]{
				Error: apierror.ErrInvalidCurrency.Ptr(),
			})
			return
		}

		var cur monetary.Currency
		err := db.Get(&cur, "SELECT * FROM currency WHERE code=$1", code)
		if err != nil {
			if errors.Is(err, sql.ErrNoRows) {
				apimodels.SendJSON(w, http.StatusNotFound, apimodels.APIResponse[apimodels.None]{
					Error: apierror.ErrCurrencyNotFound.Ptr(),
				})
				return
			}

			zap.L().Error("failed to get from db on updatecurrency", zap.Error(err))
			apimodels.SendJSON(w, http.StatusInternalServerError, apimodels.APIResponse[apimodels.None]{
				Error: apierror.ErrDatabaseFailed.WithRawErr(err).Ptr(),
			})
			return
		}

		err = easyjson.UnmarshalFromReader(r.Body, &cur)
		if err != nil {
			apimodels.SendJSON(w, http.StatusBadRequest, apimodels.APIResponse[apimodels.None]{
				Error: apierror.ErrInvalidCurrencyBody.WithRawErr(err).Ptr(),
			})
			return
		}

		if !monetary.IsCurrencyValid(cur) {
			apimodels.SendJSON(w, http.StatusBadRequest, apimodels.APIResponse[apimodels.None]{
				Error: apierror.ErrInvalidCurrencyBody.Ptr(),
			})
			return
		}

		tx, err := db.Begin()
		if err != nil {
			zap.L().Error("failed to begin tx on updatecurrency", zap.Error(err))
			apimodels.SendJSON(w, http.StatusInternalServerError, apimodels.APIResponse[apimodels.None]{
				Error: apierror.ErrDatabaseFailed.WithRawErr(err).Ptr(),
			})
			return
		}

		_, err = tx.Exec(`
		UPDATE currency
		SET max_units = $1,
			thousands_splitter = $2,
			decimal_splitter = $3,
			fixed_exchange_rate_int_part = $4,
			fixed_exchange_rate_decimal_part = $5
		WHERE code = $6
		`, cur.MaxUnits, cur.ThousandsSplitter, cur.DecimalSplitter,
			cur.FixedExchangeRateIntPart, cur.FixedExchangeRateDecimalPart,
			cur.Code)
		if err != nil {
			_ = tx.Rollback()
			zap.L().Error("failed to exec tx on updatecurrency", zap.Error(err))
			apimodels.SendJSON(w, http.StatusInternalServerError, apimodels.APIResponse[apimodels.None]{
				Error: apierror.ErrDatabaseFailed.WithRawErr(err).Ptr(),
			})
			return
		}

		byts, err := easyjson.Marshal(cur)
		if err != nil {
			_ = tx.Rollback()
			zap.L().Error("failed to marshal json on updatecurrency", zap.Error(err))
			apimodels.SendJSON(w, http.StatusInternalServerError, apimodels.APIResponse[apimodels.None]{
				Error: apierror.ErrMarshalingFailed.WithRawErr(err).Ptr(),
			})
			return
		}

		err = tx.Commit()
		if err != nil {
			zap.L().Error("failed to commit tx on updatecurrency", zap.Error(err))
			apimodels.SendJSON(w, http.StatusInternalServerError, apimodels.APIResponse[apimodels.None]{
				Error: apierror.ErrDatabaseFailed.WithRawErr(err).Ptr(),
			})
			return
		}

		apimodels.SendJSON(w, http.StatusOK, apimodels.APIResponse[json.RawMessage]{
			Response: byts,
		})
	}
}

// DeleteCurrency handles DELETE requests to the currency endpoint
// @Summary      	Delete Currency
// @Description  	Deletes a currency
// @Produce      	json
// @Param        	currency_code   path  string  true  "Currency Code"
// @Success      	200  {object}  swaggomodels.APIValidResponseMock{response=string}
// @Failure      	400  {object}  swaggomodels.APIFailResponseMock{response=apimodels.None} "bad request"
// @Failure      	500  {object}  swaggomodels.APIFailResponseMock{response=apimodels.None} "internal server error"
// @Router       	/api/v0/currencies/{currency_code} [delete]
func DeleteCurrency(db *sqlx.DB) func(http.ResponseWriter, *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		code := chi.URLParam(r, "currency.code")
		if !monetary.IsCodeValid(code) {
			apimodels.SendJSON(w, http.StatusBadRequest, apimodels.APIResponse[apimodels.None]{
				Error: apierror.ErrInvalidCurrency.Ptr(),
			})
			return
		}

		_, err := db.Exec("DELETE FROM currency WHERE code = $1", code)
		if err != nil {
			zap.L().Error("failed to exec query on deletecurrency", zap.Error(err))
			apimodels.SendJSON(w, http.StatusInternalServerError, apimodels.APIResponse[apimodels.None]{
				Error: apierror.ErrMarshalingFailed.WithRawErr(err).Ptr(),
			})
			return
		}

		apimodels.SendJSON(w, http.StatusOK, apimodels.APIResponse[string]{
			Response: "ok",
		})
	}
}
