package controllers

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"strconv"

	"github.com/Ricardo-Sales/challenge-bravo/cerrors"
	"github.com/Ricardo-Sales/challenge-bravo/models"
)

const (
	URL_GET_QUOTATION = "https://economia.awesomeapi.com.br/json/last/" // ex: last/BRL-USD

	CURRENCY_USD = "USD"
)

func CalculateQuotation(w http.ResponseWriter, r *http.Request) {

	var quotation models.Quotation
	var crIn models.Currency
	var crOut models.Currency
	var amount float64
	var err error

	if err := r.ParseForm(); err != nil {
		cerr := cerrors.Cerror{
			Message:     "Error",
			StatusCode:  http.StatusInternalServerError,
			Attribute:   "Parse form",
			Description: "Error parse form",
			Details:     err.Error(),
		}
		cerr.LogAndPostNewHurbError(w, r)
		return
	}

	crIn.Code = r.Form.Get("from")
	crOut.Code = r.Form.Get("to")

	if amount, err = strconv.ParseFloat(r.Form.Get("amount"), 64); err != nil {
		cerr := cerrors.Cerror{
			Message:     "Error",
			StatusCode:  http.StatusBadRequest,
			Attribute:   "ammount",
			Description: "INVALID_DATA_TYPE",
			Details:     "ammount field should be numeric",
		}
		cerr.LogAndPostNewHurbError(w, r)
		return
	}

	// antes de fazer na mao, ver se consigo a conversao pela api

	quot, cerr := GetFullQuotation(crIn.Code, crOut.Code)
	if cerr.StatusCode == http.StatusNotFound {
		log.Println(cerr)
		log.Println("Iniciando quotação indireta")

		if err = crIn.GetOneByCode(); err != nil {
			if err.Error() == cerrors.ErrResourceNotFound {
				cerr := cerrors.Cerror{
					Message:     "Not found",
					StatusCode:  http.StatusNotFound,
					Attribute:   "currency from",
					Description: "CURRENCY_NOT_FOUND",
					Details:     err.Error(),
				}
				cerr.LogAndPostNewHurbError(w, r)
				return
			} else {
				details := fmt.Sprintf(cerrors.ErrSearchCurrencyDB + "\n" + err.Error())
				cerr := cerrors.Cerror{
					Message:     "Internal server error",
					StatusCode:  http.StatusInternalServerError,
					Attribute:   "currency from",
					Description: "ERROR_SEARCH_DATABASE",
					Details:     details,
				}
				cerr.LogAndPostNewHurbError(w, r)
				return
			}
		}

		// preciso verificar se o tousd do Crin esta desatualizado
		// so atualizo em caso de nao ser moeda ficticia

		if crIn.Type != "FIC" && crIn.Code != "USD" {
			if quotation, err = GetQuotation(crIn.Code); err != nil {
				details := fmt.Sprintf(cerrors.ErrSearchCurrencyDB + "\n" + err.Error())
				cerr := cerrors.Cerror{
					Message:     "Internal server error",
					StatusCode:  http.StatusInternalServerError,
					Attribute:   "quotation from",
					Description: "ERROR_SEARCH_QUOTATION",
					Details:     details,
				}
				cerr.LogAndPostNewHurbError(w, r)
				return
			}
			// se a taxa de cotação estiver desatualizada, atualize
			if crIn.ToUsd != quotation.Value {
				crIn.ToUsd = quotation.Value
				if err = crIn.Update(); err != nil {
					details := fmt.Sprintf(cerrors.ErrUpdateCurrencyDB + "\n" + err.Error())
					cerr := cerrors.Cerror{
						Message:     "Internal server error",
						StatusCode:  http.StatusInternalServerError,
						Attribute:   "currency from",
						Description: "ERROR_UPDATE_DATABASE",
						Details:     details,
					}
					cerr.LogAndPostNewHurbError(w, r)
					return
				}
			}
		}

		if err = crOut.GetOneByCode(); err != nil {
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
					details := fmt.Sprintf(cerrors.ErrSearchCurrencyDB + "\n" + err.Error())
					cerr := cerrors.Cerror{
						Message:     "Internal server error",
						StatusCode:  http.StatusInternalServerError,
						Attribute:   "currency to",
						Description: "ERROR_SEARCH_DATABASE",
						Details:     details,
					}
					cerr.LogAndPostNewHurbError(w, r)
					return
				}
			}
		}
		if crOut.Type != "FIC" && crOut.Code != "USD" {
			if quotation, err = GetQuotation(crOut.Code); err != nil {
				details := fmt.Sprintf(cerrors.ErrSearchCurrencyDB + "\n" + err.Error())
				cerr := cerrors.Cerror{
					Message:     "Internal server error",
					StatusCode:  http.StatusInternalServerError,
					Attribute:   "quotation to",
					Description: "ERROR_SEARCH_QUOTATION",
					Details:     details,
				}
				cerr.LogAndPostNewHurbError(w, r)
				return
			}
			// se a taxa de cotação estiver desatualizada, atualize
			if crOut.ToUsd != quotation.Value {
				crOut.ToUsd = quotation.Value
				if err = crOut.Update(); err != nil {
					details := fmt.Sprintf(cerrors.ErrUpdateCurrencyDB + "\n" + err.Error())
					cerr := cerrors.Cerror{
						Message:     "Internal server error",
						StatusCode:  http.StatusInternalServerError,
						Attribute:   "currency to",
						Description: "ERROR_UPDATE_DATABASE",
						Details:     details,
					}
					cerr.LogAndPostNewHurbError(w, r)
					return
				}
			}
		}

		// fazendo o calculo de cotação
		tousdIn, err := strconv.ParseFloat(crIn.ToUsd, 64)
		if err != nil {
			cerr := cerrors.Cerror{
				Message:     "Internal server error",
				StatusCode:  http.StatusInternalServerError,
				Attribute:   "currency from",
				Description: "ERROR_PARSE_VALUE",
				Details:     "error parse float value to convert usd in ",
			}
			cerr.LogAndPostNewHurbError(w, r)
			return
		}
		tousdOut, err := strconv.ParseFloat(crOut.ToUsd, 64)
		if err != nil {
			cerr := cerrors.Cerror{
				Message:     "Internal server error",
				StatusCode:  http.StatusInternalServerError,
				Attribute:   "currency to",
				Description: "ERROR_PARSE_VALUE",
				Details:     "error parse float value to convert usd out ",
			}
			cerr.LogAndPostNewHurbError(w, r)
			return
		}
		valOut := (tousdIn / tousdOut) * amount
		//montando cotação para exibir
		quotOut := quotation
		quotOut.Value = fmt.Sprintf("%f", valOut)
		quotOut.Code = crIn.Name
		quotOut.Codein = crOut.Name
		quotOut.Name = fmt.Sprintf(crIn.Name + "/" + crOut.Name)

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		if err := json.NewEncoder(w).Encode(quotOut); err != nil {
			cerr := cerrors.Cerror{
				Message:     "Internal server error",
				StatusCode:  http.StatusInternalServerError,
				Attribute:   "currency to",
				Description: "ERROR_ENCODING_JSON",
				Details:     "error when encoding json. " + err.Error(),
			}
			cerr.LogAndPostNewHurbError(w, r)
			return
		}
		return
	} else {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		if err := json.NewEncoder(w).Encode(quot); err != nil {
			cerr := cerrors.Cerror{
				Message:     "Internal server error",
				StatusCode:  http.StatusInternalServerError,
				Attribute:   "currency to",
				Description: "ERROR_ENCODING_JSON",
				Details:     "error when encoding json. " + err.Error(),
			}
			cerr.LogAndPostNewHurbError(w, r)
			return
		}
	}
}

func GetQuotation(codeIn string) (models.Quotation, error) {
	var quot models.Quotation
	url := URL_GET_QUOTATION + codeIn + "-" + CURRENCY_USD

	straux := codeIn + CURRENCY_USD

	resp, err := http.Get(url)
	if err != nil {
		fmt.Println(err)
		return quot, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return quot, err
	}

	quot, cerr := UnmarshalQuotation(body, straux)
	if cerr.StatusCode != 0 {
		err = errors.New(cerr.Details)
		return quot, err
	}

	return quot, nil
}

func GetFullQuotation(codeIn string, codeOut string) (models.Quotation, cerrors.Cerror) {
	var quot models.Quotation
	fullUrl := URL_GET_QUOTATION + codeIn + "-" + codeOut
	cerrNil := cerrors.Cerror{
		Message:     "",
		StatusCode:  0,
		Attribute:   "",
		Description: "",
		Details:     "",
	}
	straux := codeIn + codeOut

	resp, err := http.Get(fullUrl)
	if err != nil {
		cerr := cerrors.Cerror{
			Message:     "Internal server error",
			StatusCode:  resp.StatusCode,
			Attribute:   "url",
			Description: "ERROR_GET_URL",
			Details:     err.Error(),
		}
		return quot, cerr

	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		cerr := cerrors.Cerror{
			Message:     "Internal server error",
			StatusCode:  http.StatusInternalServerError,
			Attribute:   "body",
			Description: "ERROR_READ_BODY",
			Details:     err.Error(),
		}
		return quot, cerr
	}
	if resp.StatusCode == http.StatusNotFound {
		err = errors.New(string(body))
		cerr := cerrors.Cerror{
			Message:     "Not found",
			StatusCode:  resp.StatusCode,
			Attribute:   "quotation",
			Description: "ERROR_GET_URL",
			Details:     err.Error(),
		}
		return quot, cerr
	}

	quot, cerr := UnmarshalQuotation(body, straux)
	if cerr.StatusCode == 0 {
		return quot, cerr
	}

	return quot, cerrNil
}

func UnmarshalQuotation(body []byte, code string) (models.Quotation, cerrors.Cerror) {
	var details string
	var cerr cerrors.Cerror
	var mapAux map[string]any
	var quot models.Quotation

	cerrNil := cerrors.Cerror{
		Message:     "",
		StatusCode:  0,
		Attribute:   "",
		Description: "",
		Details:     "",
	}

	err := json.Unmarshal(body, &mapAux)
	if err != nil {
		details = fmt.Sprintf(cerrors.ErrUnmarshalBody + "\n" + err.Error())
		cerr = cerrors.Cerror{
			Message:     "Internal server error",
			StatusCode:  http.StatusInternalServerError,
			Attribute:   "body",
			Description: "ERROR_UNMARSHAL",
			Details:     details,
		}
		return quot, cerr
	}

	aux := mapAux[code].(map[string]any)
	quot.Code = aux["code"].(string)
	quot.Codein = (aux["codein"]).(string)
	quot.Name = (aux["name"]).(string)
	quot.Value = (aux["bid"]).(string)
	quot.CreateDate = (aux["create_date"]).(string)

	return quot, cerrNil
}
