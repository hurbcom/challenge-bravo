package cerrors

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"

	val "github.com/go-playground/validator/v10"
	"github.com/go-sql-driver/mysql"
)

const (
	ErrInvalidID       = "ID not found "
	ErrInvalidCode     = "code field must be string "
	ErrCaseCode        = "code field must be upper case "
	ErrInvalidName     = "name field must be string "
	ErrInvalidToUsd    = "tousd field must be string "
	ErrInvalidDotToUsd = "tousd field must have a dot '.' for decimals "
	ErrInvalidTType    = "type field must be string"
	ErrCaseType        = "type field must be upper case "

	ErrInvalidType = "type field must have only 'phy','vir' or 'fic' upper case values "

	ErrParseBody              = "error when reading request body "
	ErrUnmarshalBody          = "error when unmarshal request body "
	ErrUnmarshalBodyQuotation = "error when unmarshal request body from quotation "
	ErrUpdateCurrencyDB       = "error when update currency on database "
	ErrSearchCurrencyDB       = "error when search currency on database "
	ErrSaveCurrencyDB         = "error when save currency on database "
	ErrDuplicateCodeDB        = "existing value in code field "
	ErrDeleteCurrencyDB       = "error when delete currency on database "

	ErrSendResponseBody = "error when send response body "

	ErrResourceNotFound = "resource not found "

	ErrInvalidCodeQuot       = "code field must be string "
	ErrInvalidCodeInQuot     = "codein field must be string "
	ErrInvalidNameQuot       = "codein field must be string "
	ErrInvalidValueQuot      = "value field must be string "
	ErrInvalidCreateDateQuot = "create_date field must be string "
)

type Cerror struct {
	Message     string `json:"message"`
	StatusCode  int    `json:"status-code"`
	Attribute   string `json:"attribute"`
	Description string `json:"description"`
	Details     string `json:"details"`
}

func (cerror *Cerror) LogAndPostNewHurbError(w http.ResponseWriter, r *http.Request) error {

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(cerror.StatusCode)
	if err := json.NewEncoder(w).Encode(cerror); err != nil {
		return err
	}
	log.Printf("\nError:{\n\tMessage: %s\n\tStatusCode: %d\n\tAttribute: %s\n\tDescription: %s\n\tDetails: %s\n}",
		cerror.Message, cerror.StatusCode, cerror.Attribute, cerror.Description, cerror.Details)
	return nil
}

func LogAndPostNewArrayHurbError(w http.ResponseWriter, r *http.Request, verr []Cerror) error {
	var cerr Cerror
	var aux string
	var vstr []string
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusBadRequest)

	if err := json.NewEncoder(w).Encode(verr); err != nil {
		return err
	}
	for _, cerr = range verr {
		aux = fmt.Sprintf("\nError:{\n\tMessage: %s\n\tStatusCode: %d\n\tAttribute: %s\n\tDescription: %s\n\tDetails: %s\n}",
			cerr.Message, cerr.StatusCode, cerr.Attribute, cerr.Description, cerr.Details)
		vstr = append(vstr, aux)
	}
	log.Println(vstr)
	return nil
}

func TreatValidateFields(w http.ResponseWriter, r *http.Request, err error) {
	var verr []Cerror
	var cerr Cerror

	str := ""
	for _, err := range err.(val.ValidationErrors) {
		if err.Tag() == "required" {
			str = fmt.Sprintf("%s field is required", err.Field())
			cerr = Cerror{
				Message:     "Bad request",
				StatusCode:  http.StatusBadRequest,
				Attribute:   err.Field(),
				Description: "INVALID_VALUE",
				Details:     str,
			}
			verr = append(verr, cerr)
		}
		if err.Tag() == "min" {
			str = fmt.Sprintf("%s field must be %s characters at least", err.Field(), err.Param())
			cerr = Cerror{
				Message:     "Bad request",
				StatusCode:  http.StatusBadRequest,
				Attribute:   err.Field(),
				Description: "INVALID_LENGTH",
				Details:     str,
			}
			verr = append(verr, cerr)
		}
		if err.Tag() == "max" {
			str = fmt.Sprintf("%s field can only have a maximum of %s characters", err.Field(), err.Param())
			cerr = Cerror{
				Message:     "Bad request",
				StatusCode:  http.StatusBadRequest,
				Attribute:   err.Field(),
				Description: "INVALID_LENGTH",
				Details:     str,
			}
			verr = append(verr, cerr)
		}
		if err.Tag() == "len" {
			str = fmt.Sprintf("%s field must have  only %s characters", err.Field(), err.Param())
			cerr = Cerror{
				Message:     "Bad request",
				StatusCode:  http.StatusBadRequest,
				Attribute:   err.Field(),
				Description: "INVALID_LENGTH",
				Details:     str,
			}
			verr = append(verr, cerr)
		}
	}
	LogAndPostNewArrayHurbError(w, r, verr)
}
func TreatDatabaseError(w http.ResponseWriter, r *http.Request, err error) {
	var fields []string
	var field string
	var vals []string
	var val string

	if me, ok := err.(*mysql.MySQLError); ok {
		if me.Number == 1062 {
			vals = strings.Split(me.Message, " ")
			val = strings.Trim(vals[2], "'")

			fields = strings.Split(me.Message, "key ")
			field = strings.Trim(fields[1], "'")
			fields = strings.Split(me.Message, ".")
			fields = strings.Split(fields[1], "_")
			field = fields[0]
		}
		details := fmt.Sprintf("field %s with value '%s' already exists", field, val)
		cerr := Cerror{
			Message:     "Bad request",
			StatusCode:  http.StatusBadRequest,
			Attribute:   field,
			Description: "DUPLICATE_KEY",
			Details:     details,
		}
		cerr.LogAndPostNewHurbError(w, r)
	}

}
