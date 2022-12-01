package controllers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"reflect"
	"strconv"
	"strings"

	"github.com/Ricardo-Sales/challenge-bravo/cerrors"
	"github.com/Ricardo-Sales/challenge-bravo/models"
	val "github.com/go-playground/validator/v10"
	"github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
)

const (
	ERROR_TYPE = "invalid value of type"
)

func GetAllCurrency(w http.ResponseWriter, r *http.Request) {
	var crs []models.Currency
	var err error
	var details string

	crs, err = models.GetAll()
	if err != nil {
		details = fmt.Sprintf(cerrors.ErrSearchCurrencyDB + "\n" + err.Error())
		cerr := cerrors.Cerror{
			Message:     "Internal server error",
			StatusCode:  http.StatusInternalServerError,
			Attribute:   "body",
			Description: "ERROR_SEARCH_DATABASE",
			Details:     details,
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
	var details string

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
			details = fmt.Sprintf(cerrors.ErrSearchCurrencyDB + "\n" + err.Error())
			cerr := cerrors.Cerror{
				Message:     "Internal server error",
				StatusCode:  http.StatusInternalServerError,
				Attribute:   "body",
				Description: "ERROR_SEARCH_DATABASE",
				Details:     details,
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
	var cerrs []cerrors.Cerror
	var details string

	body, err := io.ReadAll(r.Body)
	if err != nil {
		details = fmt.Sprintf(cerrors.ErrParseBody + "\n" + err.Error())
		cerr := cerrors.Cerror{
			Message:     "Internal server error",
			StatusCode:  http.StatusInternalServerError,
			Attribute:   "body",
			Description: "ERROR_PARSE_BODY",
			Details:     details,
		}
		cerr.LogAndPostNewHurbError(w, r)
		return
	}
	defer r.Body.Close()

	cerrs = UnmarshalValidating(body, &cr)
	if len(cerrs) > 0 {
		cerrors.LogAndPostNewArrayHurbError(w, r, cerrs)
		return
	}

	validate := val.New()
	err = validate.Struct(cr)
	if err != nil {
		cerrors.TreatValidateFields(w, r, err)
		return
	}

	if err = cr.Save(); err != nil {
		if err == err.(*mysql.MySQLError) && err.(*mysql.MySQLError).Number == 1062 {
			cerrors.TreatDatabaseError(w, r, err)
			return
		} else {
			details = fmt.Sprintf(cerrors.ErrSaveCurrencyDB + "\n" + err.Error())
			cerr := cerrors.Cerror{
				Message:     "Internal server error",
				StatusCode:  http.StatusInternalServerError,
				Attribute:   "currency",
				Description: "ERROR_DATABASE",
				Details:     details,
			}

			cerr.LogAndPostNewHurbError(w, r)
			return
		}
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
	var details string
	var cerrs []cerrors.Cerror

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
		details = fmt.Sprintf(cerrors.ErrParseBody + "\n" + err.Error())
		cerr := cerrors.Cerror{
			Message:     "Internal server error",
			StatusCode:  http.StatusInternalServerError,
			Attribute:   "body",
			Description: "ERROR_PARSE_BODY",
			Details:     details,
		}
		cerr.LogAndPostNewHurbError(w, r)
		return
	}
	defer r.Body.Close()

	cerrs = UnmarshalValidating(body, &cr)
	if len(cerrs) > 0 {
		cerrors.LogAndPostNewArrayHurbError(w, r, cerrs)
		return
	}

	if err = cr.Update(); err != nil {
		if err == err.(*mysql.MySQLError) && err.(*mysql.MySQLError).Number == 1062 {
			cerrors.TreatDatabaseError(w, r, err)
			return
		} else {
			details = fmt.Sprintf(cerrors.ErrUpdateCurrencyDB + "\n" + err.Error())
			cerr := cerrors.Cerror{
				Message:     "Internal server error",
				StatusCode:  http.StatusInternalServerError,
				Attribute:   "currency",
				Description: "ERROR_DATABASE",
				Details:     details,
			}
			cerr.LogAndPostNewHurbError(w, r)
			return
		}
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err = json.NewEncoder(w).Encode(cr); err != nil {
		details = fmt.Sprintf(cerrors.ErrSendResponseBody + "\n" + err.Error())
		cerr := cerrors.Cerror{
			Message:     "Internal server error",
			StatusCode:  http.StatusInternalServerError,
			Attribute:   "currency",
			Description: "ERROR_SEND_BODY",
			Details:     details,
		}
		cerr.LogAndPostNewHurbError(w, r)
		return
	}
}

func DeleteCurrency(w http.ResponseWriter, r *http.Request) {
	var cr models.Currency
	var details string

	params := mux.Vars(r)
	ID, err := strconv.ParseUint(params["id"], 10, 32)
	if err != nil {
		cerr := cerrors.Cerror{
			Message:     "Bad request",
			StatusCode:  http.StatusBadRequest,
			Attribute:   "id",
			Description: "INVALID_FORMAT",
			Details:     cerrors.ErrInvalidID,
		}
		cerr.LogAndPostNewHurbError(w, r)
		return
	}
	cr.ID = uint32(ID)

	if err = cr.Delete(); err != nil {
		details = fmt.Sprintf(cerrors.ErrDeleteCurrencyDB + "\n" + err.Error())
		cerr := cerrors.Cerror{
			Message:     "Internal server error",
			StatusCode:  http.StatusInternalServerError,
			Attribute:   "currency",
			Description: "ERROR_DATABASE",
			Details:     details,
		}
		cerr.LogAndPostNewHurbError(w, r)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusNoContent)
}

func UnmarshalValidating(body []byte, cr *models.Currency) []cerrors.Cerror {
	var details string
	var cerrs []cerrors.Cerror

	aux := make(map[string]interface{})
	err := json.Unmarshal(body, &aux)
	if err != nil {
		details = fmt.Sprintf(cerrors.ErrUnmarshalBody + "\n" + err.Error())
		cerr := cerrors.Cerror{
			Message:     "Internal server error",
			StatusCode:  http.StatusInternalServerError,
			Attribute:   "body",
			Description: "ERROR_UNMARSHAL",
			Details:     details,
		}
		cerrs = append(cerrs, cerr)

	}

	if reflect.TypeOf(aux["code"]) != reflect.TypeOf(cr.Code) {
		cerr := cerrors.Cerror{
			Message:     "Bad Request",
			StatusCode:  http.StatusBadRequest,
			Attribute:   "code",
			Description: "INVALID_DATA_TYPE",
			Details:     cerrors.ErrInvalidCode,
		}
		cerrs = append(cerrs, cerr)
	} else if strings.ToUpper(aux["code"].(string)) != aux["code"].(string) {
		cerr := cerrors.Cerror{
			Message:     "Bad Request",
			StatusCode:  http.StatusBadRequest,
			Attribute:   "code",
			Description: "INVALID_DATA_TYPE",
			Details:     cerrors.ErrCaseCode,
		}
		cerrs = append(cerrs, cerr)
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
		cerrs = append(cerrs, cerr)
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
		cerrs = append(cerrs, cerr)
	} else {
		cr.ToUsd = (aux["tousd"]).(string)
	}
	if reflect.TypeOf(aux["type"]) != reflect.TypeOf(cr.Type) {
		cerr := cerrors.Cerror{
			Message:     "Bad Request",
			StatusCode:  http.StatusBadRequest,
			Attribute:   "tousd",
			Description: "INVALID_DATA_TYPE",
			Details:     cerrors.ErrInvalidType,
		}
		cerrs = append(cerrs, cerr)
	} else if strings.ToUpper(aux["type"].(string)) != aux["type"].(string) {
		cerr := cerrors.Cerror{
			Message:     "Bad Request",
			StatusCode:  http.StatusBadRequest,
			Attribute:   "code",
			Description: "INVALID_DATA_TYPE",
			Details:     cerrors.ErrCaseType,
		}
		cerrs = append(cerrs, cerr)
	} else if res := ValidateType(aux["type"].(string)); res == ERROR_TYPE {
		cerr := cerrors.Cerror{
			Message:     "Bad Request",
			StatusCode:  http.StatusBadRequest,
			Attribute:   "code",
			Description: "INVALID_FORMAT",
			Details:     cerrors.ErrInvalidType,
		}
		cerrs = append(cerrs, cerr)
	} else {
		cr.Type = (aux["type"]).(string)
	}

	return cerrs
}

func ValidateType(typ string) string {

	switch typ {
	case "PHY": // for physical currency ex: USD, BRL
		return typ
	case "VIR": // for virtual currency ex: BTC, ETH
		return typ
	case "FIC": // for ficticious currency ex: PSN, GTA
		return typ
	default:
		return ERROR_TYPE
	}
}
