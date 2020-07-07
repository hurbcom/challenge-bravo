package rest

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/go-chi/chi"
	"github.com/hurbcom/challenge-bravo/pkg/boleto"
)

type (
	ErrBoletoCode string

	ErrBoletoHTTPResponse struct {
		Code    ErrBoletoCode `json:"code"`    // Error code
		Message string        `json:"message"` // Error message
	}
)

type (
	BoletoIssuerRegisterHTTPResponse struct {
		Type  string `json:"type"`  // The type of issuer register
		Value string `json:"value"` // The value of issuer register
	}

	BoletoIssuerBankHTTPResponse struct {
		BankNumber  string `json:"number"`       // The issuer bank number
		FantasyName string `json:"fantasy_name"` // The issuer fantasy name (populated by us)
	}

	BoletoIssuerHTTPResponse struct {
		Name        string                           `json:"name"`         // The issuer name (Razão social)
		FantasyName string                           `json:"fantasy_name"` // The issuer fantasy name (populated by us)
		LogoURL     string                           `json:"logo_url"`     // The issuer logo url (populated by us)
		Activity    string                           `json:"activity"`     // The issuer activity (populated by us)
		Bank        BoletoIssuerBankHTTPResponse     `json:"bank"`         // The issuer bank
		Address     string                           `json:"address"`      // The issuer address
		Register    BoletoIssuerRegisterHTTPResponse `json:"register"`     // The object with issuer register data
	}

	BoletoPayerRegisterHTTPResponse struct {
		Type  string `json:"type"`  // The type of payer register
		Value string `json:"value"` // The value of payer register
	}

	BoletoPayerHTTPResponse struct {
		Name     string                          `json:"name"`     // The payer name
		Register BoletoPayerRegisterHTTPResponse `json:"register"` // The object with payer register data
	}

	BoletoMulctHTTPResponse struct {
		Currency string `json:"currency"` // The currency of mulct
		Value    int64  `json:"value"`    // The value of mulct
	}

	BoletoCostHTTPResponse struct {
		Currency string `json:"currency"` // The currency of cost
		Value    int64  `json:"value"`    // The value of cost
	}

	BoletoHTTPResponse struct {
		Identifier            string                   `json:"id"`                      // The boleto identifier
		Segment               string                   `json:"segment"`                 // The boleto segment (NORMAL or CONVENANT)
		Description           string                   `json:"description"`             // The boleto description
		Issuer                BoletoIssuerHTTPResponse `json:"issuer"`                  // The object with issuer data
		Payer                 BoletoPayerHTTPResponse  `json:"payer"`                   // The object with payer data
		Reason                string                   `json:"reason"`                  // What the user is buying
		IssueDate             time.Time                `json:"issue_date"`              // The issue date
		DueDate               time.Time                `json:"due_date"`                // The due date
		Interest              float64                  `json:"interest"`                // The interest
		Mulct                 BoletoMulctHTTPResponse  `json:"fine"`                    // The object with current and value from mulct
		Cost                  BoletoCostHTTPResponse   `json:"cost"`                    // The object with currency and value from cost
		Barcode               string                   `json:"barcode"`                 // The barcode
		Paid                  bool                     `json:"paid"`                    // The flag that says if the boleto was paid or not
		OriginalURL           string                   `json:"original_url"`            // The original url to download boleto file
		AutomaticDebitApplied bool                     `json:"automatic_debit_applied"` // The flag that says if the automatic debiat is activated for this boleto
	}

	BoletoReceiptHTTPResponse struct {
		Identifier     string                   `json:"id"`             // The boleto identifier
		Issuer         BoletoIssuerHTTPResponse `json:"issuer"`         // The boleto issuer
		Payer          BoletoPayerHTTPResponse  `json:"payer"`          // The boleto payer
		Cost           BoletoCostHTTPResponse   `json:"cost"`           // The boleto cost
		ValuePaid      int64                    `json:"value_paid"`     // The boleto value paid
		DueDate        time.Time                `json:"due_date"`       // The boleto due date
		Discount       int64                    `json:"discount"`       // The receipt discount
		Mulct          BoletoMulctHTTPResponse  `json:"fine"`           // The fine of boleto
		Interest       int64                    `json:"interest"`       // The interest of boleto
		Authentication string                   `json:"authentication"` // The receipt authentication
		BankNumber     string                   `json:"bank_number"`    // The Bank number where the boleto was paid
		PaymentDate    time.Time                `json:"payment_date"`   // The receipt payment date
	}
)

var (
	ErrBoletoCodeUnexptected     ErrBoletoCode = "B_1"
	ErrBoletoCodeNotFound        ErrBoletoCode = "B_2"
	ErrBoletoReceiptCodeNotFound ErrBoletoCode = "B_3"
)

// v1alphaRetrieveBoletos godoc
// @Summary List boletos
// @Description List all boletos from a valid user
// @Produce  json
// @Success 200 {object} BoletoHTTPResponse
// @Header 200 {string} X-User-JWT "JWT"
// @Failure 401 {object} ErrBoletoHTTPResponse
// @Failure 500 {object} ErrBoletoHTTPResponse
// @Router /v1alpha/boletos [get]
func v1alphaRetrieveBoletos(s boleto.Service) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		bs, err := s.RetriveBoletos()
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			httperr := &ErrBoletoHTTPResponse{
				Code:    ErrBoletoCodeUnexptected,
				Message: err.Error(),
			}
			if err = json.NewEncoder(w).Encode(httperr); err != nil {
				log.Println(err)
			}
			return
		}

		body := make([]BoletoHTTPResponse, 0)
		for _, b := range bs {
			body = append(body, toBoletoHTTPResponse(b))
		}

		w.Header().Set("Content-Type", "application/json")
		if err = json.NewEncoder(w).Encode(body); err != nil {
			log.Println(err)

			w.WriteHeader(http.StatusInternalServerError)
			return
		}
	}
}

// v1alphaGetBoleto godoc
// @Summary Get boleto
// @Description Get a specific boleto from a valid user
// @Produce  json
// @Param boleto_id path int true "Boleto identifier"
// @Success 200 {object} BoletoHTTPResponse
// @Header 200 {string} X-User-JWT "JWT"
// @Failure 401 {object} ErrBoletoHTTPResponse
// @Failure 404 {object} ErrBoletoHTTPResponse
// @Failure 500 {object} ErrBoletoHTTPResponse
// @Router /v1alpha/boletos/{boleto_id} [get]
func v1alphaGetBoleto(s boleto.Service) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		boletoIdentifier := chi.URLParam(r, "boleto_id")
		b, err := s.GetBoleto(boletoIdentifier)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			httperr := &ErrBoletoHTTPResponse{
				Code:    ErrBoletoCodeUnexptected,
				Message: err.Error(),
			}
			if err = json.NewEncoder(w).Encode(httperr); err != nil {
				log.Println(err)
			}
			return
		}

		body := toBoletoHTTPResponse(*b)

		w.Header().Set("Content-Type", "application/json")
		if err = json.NewEncoder(w).Encode(body); err != nil {
			log.Println(err)

			w.WriteHeader(http.StatusInternalServerError)
			return
		}
	}
}

// v1alphaGetBoletoReceipt godoc
// @Summary Get boleto
// @Description Get a specific boleto from a valid user
// @Produce  json
// @Param boleto_id path int true "Boleto identifier"
// @Success 200 {object} BoletoHTTPResponse
// @Header 200 {string} X-User-JWT "JWT"
// @Failure 401 {object} ErrBoletoHTTPResponse
// @Failure 404 {object} ErrBoletoHTTPResponse
// @Failure 500 {object} ErrBoletoHTTPResponse
// @Router /v1alpha/boletos/{boleto_id}/receipt [get]
func v1alphaGetBoletoReceipt(s boleto.Service) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		boletoIdentifier := chi.URLParam(r, "boleto_id")
		b, err := s.GetBoleto(boletoIdentifier)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			httperr := &ErrBoletoHTTPResponse{
				Code:    ErrBoletoCodeUnexptected,
				Message: err.Error(),
			}
			if err = json.NewEncoder(w).Encode(httperr); err != nil {
				log.Println(err)
			}
			return
		}

		w.Header().Set("Content-Type", "application/json")

		if !b.Paid {
			w.WriteHeader(http.StatusNotFound)
			httperr := &ErrBoletoHTTPResponse{
				Code:    ErrBoletoReceiptCodeNotFound,
				Message: "boleto receipt not found",
			}
			if err = json.NewEncoder(w).Encode(httperr); err != nil {
				log.Println(err)

				w.WriteHeader(http.StatusInternalServerError)
				return
			}
			return
		}

		body := toBoletoReceipt(*b)

		if err = json.NewEncoder(w).Encode(body); err != nil {
			log.Println(err)

			w.WriteHeader(http.StatusInternalServerError)
			return
		}
	}
}

func toBoletoReceipt(b boleto.Boleto) BoletoReceiptHTTPResponse {
	return BoletoReceiptHTTPResponse{
		Identifier: b.Identifier,
		Issuer: BoletoIssuerHTTPResponse{
			Name:        b.Issuer.Name,
			FantasyName: b.Issuer.FantasyName,
			LogoURL:     b.Issuer.LogoURL,
			Activity:    b.Issuer.Activity,
		},
		Payer: BoletoPayerHTTPResponse{
			Name: b.Payer.Name,
			Register: BoletoPayerRegisterHTTPResponse{
				Type:  b.Payer.Register.Type,
				Value: b.Payer.Register.Value,
			},
		},
		DueDate:   b.DueDate,
		ValuePaid: b.Receipt.Value,
		Mulct: BoletoMulctHTTPResponse{
			Currency: b.Mulct.Currency,
			Value:    b.Mulct.Value,
		},
		Discount:    b.Receipt.Discount,
		Interest:    int64(b.Interest),
		BankNumber:  b.Receipt.Bank,
		PaymentDate: b.Receipt.PaymentDate,
	}
}

func toBoletoHTTPResponse(b boleto.Boleto) BoletoHTTPResponse {
	return BoletoHTTPResponse{
		Identifier:  b.Identifier,
		Segment:     string(b.Segment),
		Description: b.Description,
		Issuer: BoletoIssuerHTTPResponse{
			Name:        b.Issuer.Name,
			FantasyName: b.Issuer.FantasyName,
			LogoURL:     b.Issuer.LogoURL,
			Activity:    b.Issuer.Activity,
			Bank: BoletoIssuerBankHTTPResponse{
				BankNumber:  b.Issuer.Bank.BankNumber,
				FantasyName: b.Issuer.Bank.FantasyName,
			},
			Address: b.Issuer.Address,
			Register: BoletoIssuerRegisterHTTPResponse{
				Type:  b.Issuer.Register.Type,
				Value: b.Issuer.Register.Value,
			},
		},
		Payer: BoletoPayerHTTPResponse{
			Name: b.Payer.Name,
			Register: BoletoPayerRegisterHTTPResponse{
				Type:  b.Payer.Register.Type,
				Value: b.Payer.Register.Value,
			},
		},
		Reason:    b.Reason,
		IssueDate: b.IssueDate,
		DueDate:   b.DueDate,
		Interest:  b.Interest.ToFractional(),
		Mulct: BoletoMulctHTTPResponse{
			Currency: b.Mulct.Currency,
			Value:    b.Mulct.Value,
		},
		Cost: BoletoCostHTTPResponse{
			Currency: b.Cost.Currency,
			Value:    b.Cost.Value,
		},
		Barcode: b.BarCode,
		Paid:    b.Paid,
	}
}
