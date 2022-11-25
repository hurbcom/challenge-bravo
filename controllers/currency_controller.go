package controllers

import (
	"encoding/json"
	"io"
	"net/http"
	"reflect"
	"strconv"

	"github.com/Ricardo-Sales/challenge-bravo/cerrors"
	"github.com/Ricardo-Sales/challenge-bravo/models"
	"github.com/gorilla/mux"
)

func GetAllCurrency(w http.ResponseWriter, r *http.Request) {
	var crs []models.Currency
	var err error

	crs, err = models.GetAll()
	if err != nil {
		cerr := cerrors.Cerror{
			Message:     "Internal server error",
			StatusCode:  http.StatusInternalServerError,
			Attribute:   "body",
			Description: "ERROR_SEARCH_DATABASE",
			Details:     cerrors.ErrSearchCurrencyDB + err.Error(),
		}
		cerr.LogAndPostNewHurbError(w, r)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err = json.NewEncoder(w).Encode(crs); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
	}
}

func GetOneCurrency(w http.ResponseWriter, r *http.Request) {
	var cr models.Currency
	var err error

	params := mux.Vars(r)
	id, err := strconv.ParseUint(params["id"], 10, 32)
	if err != nil {
		cerr := cerrors.Cerror{
			Message:     "Bad request",
			StatusCode:  http.StatusBadRequest,
			Attribute:   "id",
			Description: "INVALID_FORMAT",
			Details:     cerrors.ErrInvalidToUsd,
		}
		cerr.LogAndPostNewHurbError(w, r)
		return
	}
	cr.ID = uint32(id)

	err = cr.GetOne()
	if err != nil {
		if err.Error() == cerrors.ErrResourceNotFound {
			cerr := cerrors.Cerror{
				Message:     "Not found",
				StatusCode:  http.StatusNotFound,
				Attribute:   "currency",
				Description: "CURRENCY_NOT_FOUND",
				Details:     err.Error(),
			}
			cerr.LogAndPostNewHurbError(w, r)
			return
		} else {
			cerr := cerrors.Cerror{
				Message:     "Internal server error",
				StatusCode:  http.StatusInternalServerError,
				Attribute:   "body",
				Description: "ERROR_SEARCH_DATABASE",
				Details:     cerrors.ErrSearchCurrencyDB + err.Error(),
			}
			cerr.LogAndPostNewHurbError(w, r)
			return
		}
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err = json.NewEncoder(w).Encode(cr); err != nil {
		w.Write([]byte(err.Error()))
		return
	}
}

func PostCurrency(w http.ResponseWriter, r *http.Request) {

	var cr models.Currency

	body, err := io.ReadAll(r.Body)
	if err != nil {
		cerr := cerrors.Cerror{
			Message:     "Internal server error",
			StatusCode:  http.StatusInternalServerError,
			Attribute:   "body",
			Description: "ERROR_PARSE_BODY",
			Details:     cerrors.ErrParseBody + err.Error(),
		}
		cerr.LogAndPostNewHurbError(w, r)
		return
	}

	cerr := UnmarshalValidating(body, &cr)
	if cerr.Message != "nil" {
		cerr.LogAndPostNewHurbError(w, r)
		return
	}

	if err = cr.Save(); err != nil {
		cerr := cerrors.Cerror{
			Message:     "Internal server error",
			StatusCode:  http.StatusInternalServerError,
			Attribute:   "currency",
			Description: "ERROR_DATABASE",
			Details:     cerrors.ErrUpdateCurrencyDB + err.Error(),
		}
		cerr.LogAndPostNewHurbError(w, r)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err = json.NewEncoder(w).Encode(cr); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}
}

func PutCurrency(w http.ResponseWriter, r *http.Request) {
	var cr models.Currency

	params := mux.Vars(r)
	ID, err := strconv.ParseUint(params["id"], 10, 32)
	if err != nil {
		cerr := cerrors.Cerror{
			Message:     "Bad request",
			StatusCode:  http.StatusBadRequest,
			Attribute:   "id",
			Description: "INVALID_FORMAT",
			Details:     cerrors.ErrInvalidToUsd,
		}
		cerr.LogAndPostNewHurbError(w, r)
		return
	}
	cr.ID = uint32(ID)

	body, err := io.ReadAll(r.Body)
	if err != nil {
		cerr := cerrors.Cerror{
			Message:     "Internal server error",
			StatusCode:  http.StatusInternalServerError,
			Attribute:   "body",
			Description: "ERROR_PARSE_BODY",
			Details:     cerrors.ErrParseBody + err.Error(),
		}
		cerr.LogAndPostNewHurbError(w, r)
		return
	}
	// implementando metodo de validação do unmarshal

	cerr := UnmarshalValidating(body, &cr)
	if cerr.Message != "nil" {
		cerr.LogAndPostNewHurbError(w, r)
		return
	}

	if err = cr.Update(); err != nil {
		cerr := cerrors.Cerror{
			Message:     "Internal server error",
			StatusCode:  http.StatusInternalServerError,
			Attribute:   "currency",
			Description: "ERROR_DATABASE",
			Details:     cerrors.ErrUpdateCurrencyDB + err.Error(),
		}
		cerr.LogAndPostNewHurbError(w, r)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err = json.NewEncoder(w).Encode(cr); err != nil {
		cerr := cerrors.Cerror{
			Message:     "Internal server error",
			StatusCode:  http.StatusInternalServerError,
			Attribute:   "currency",
			Description: "ERROR_SEND_BODY",
			Details:     cerrors.ErrSendResponseBody + err.Error(),
		}
		cerr.LogAndPostNewHurbError(w, r)
		return
	}
}

func DeleteCurrency(w http.ResponseWriter, r *http.Request) {
	var cr models.Currency

	params := mux.Vars(r)
	ID, err := strconv.ParseUint(params["id"], 10, 32)
	if err != nil {
		cerr := cerrors.Cerror{
			Message:     "Bad request",
			StatusCode:  http.StatusBadRequest,
			Attribute:   "id",
			Description: "INVALID_FORMAT",
			Details:     cerrors.ErrInvalidToUsd,
		}
		cerr.LogAndPostNewHurbError(w, r)
		return
	}
	cr.ID = uint32(ID)

	if err = cr.Delete(); err != nil {
		cerr := cerrors.Cerror{
			Message:     "Internal server error",
			StatusCode:  http.StatusInternalServerError,
			Attribute:   "currency",
			Description: "ERROR_DATABASE",
			Details:     cerrors.ErrUpdateCurrencyDB + err.Error(),
		}
		cerr.LogAndPostNewHurbError(w, r)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusNoContent)
}

func UnmarshalValidating(body []byte, cr *models.Currency) cerrors.Cerror {
	Nilerr := cerrors.Cerror{
		Message:     "nil",
		StatusCode:  0,
		Attribute:   "",
		Description: "",
		Details:     "",
	}

	aux := make(map[string]interface{})
	err := json.Unmarshal(body, &aux)
	if err != nil {
		cerr := cerrors.Cerror{
			Message:     "Internal server error",
			StatusCode:  http.StatusInternalServerError,
			Attribute:   "body",
			Description: "ERROR_UNMARSHAL",
			Details:     cerrors.ErrUnmarshalBody + err.Error(),
		}
		return cerr
	}

	if reflect.TypeOf(aux["code"]) != reflect.TypeOf(cr.Code) {
		cerr := cerrors.Cerror{
			Message:     "Bad Request",
			StatusCode:  http.StatusBadRequest,
			Attribute:   "code",
			Description: "INVALID_DATA_TYPE",
			Details:     cerrors.ErrInvalidCode,
		}
		return cerr
	} else if aux["code"] == nil || aux["code"] == "" {
		cerr := cerrors.Cerror{
			Message:     "Bad Request",
			StatusCode:  http.StatusBadRequest,
			Attribute:   "code",
			Description: "INVALID_FORMAT",
			Details:     cerrors.ErrEmptycode,
		}
		return cerr
	} else {
		cr.Code = (aux["code"]).(string)
	}

	if reflect.TypeOf(aux["name"]) != reflect.TypeOf(cr.Name) {
		cerr := cerrors.Cerror{
			Message:     "Bad Request",
			StatusCode:  http.StatusBadRequest,
			Attribute:   "name",
			Description: "INVALID_DATA_TYPE",
			Details:     cerrors.ErrInvalidName,
		}
		return cerr
	} else if aux["name"] == nil || aux["name"] == "" {
		cerr := cerrors.Cerror{
			Message:     "Bad Request",
			StatusCode:  http.StatusBadRequest,
			Attribute:   "code",
			Description: "INVALID_FORMAT",
			Details:     cerrors.ErrEmptyName,
		}
		return cerr
	} else {
		cr.Name = (aux["name"]).(string)
	}

	if reflect.TypeOf(aux["tousd"]) != reflect.TypeOf(cr.ToUsd) {
		cerr := cerrors.Cerror{
			Message:     "Bad Request",
			StatusCode:  http.StatusBadRequest,
			Attribute:   "tousd",
			Description: "INVALID_DATA_TYPE",
			Details:     cerrors.ErrInvalidToUsd,
		}
		return cerr
	} else if aux["tousd"] == nil || aux["tousd"] == "" {
		cerr := cerrors.Cerror{
			Message:     "Bad Request",
			StatusCode:  http.StatusBadRequest,
			Attribute:   "code",
			Description: "INVALID_FORMAT",
			Details:     cerrors.ErrEmptyToUsd,
		}
		return cerr
	} else {
		cr.ToUsd = (aux["tousd"]).(float64)
	}
	if reflect.TypeOf(aux["type"]) != reflect.TypeOf(cr.Type) {
		cerr := cerrors.Cerror{
			Message:     "Bad Request",
			StatusCode:  http.StatusBadRequest,
			Attribute:   "tousd",
			Description: "INVALID_DATA_TYPE",
			Details:     cerrors.ErrInvalidType,
		}
		return cerr
	} else if aux["type"] == nil || aux["type"] == "" {
		cerr := cerrors.Cerror{
			Message:     "Bad Request",
			StatusCode:  http.StatusBadRequest,
			Attribute:   "code",
			Description: "INVALID_FORMAT",
			Details:     cerrors.ErrEmptyType,
		}
		return cerr
	} else {
		cr.Type = (aux["type"]).(string)
	}

	return Nilerr
}
