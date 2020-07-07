package memory

import (
	"fmt"
	"time"

	"github.com/hurbcom/challenge-bravo/pkg/boleto"
)

type ErrBoletoNotFound struct {
	BoletoIdentifier string
}

func (err *ErrBoletoNotFound) Error() string {
	return fmt.Sprintf("boleto %v not found\n", err.BoletoIdentifier)
}

type BoletoMulct struct {
	Currency string
	Value    int64
}

type BoletoCost struct {
	Currency string
	Value    int64
}

type BoletoIssuerRegister struct {
	Type  string
	Value string
}

type BoletoIssuerBank struct {
	BankNumber  string
	FantasyName string
}

type BoletoIssuer struct {
	Name        string
	FantasyName string
	LogoURL     string
	Activity    string
	Bank        BoletoIssuerBank
	Address     string
	Register    BoletoIssuerRegister
}

type BoletoPayerRegister struct {
	Type  string
	Value string
}

type BoletoPayer struct {
	Name     string
	Register BoletoPayerRegister
}

type BoletoReceipt struct {
	PaymentDate time.Time
	Bank        string
	Value       int64
}

type Boleto struct {
	Identifier            string
	Segment               string
	Description           string
	Issuer                BoletoIssuer
	Payer                 BoletoPayer
	Reason                string
	IssueDate             time.Time
	DueDate               time.Time
	Interest              int64
	Mulct                 BoletoMulct
	Cost                  BoletoCost
	BarCode               string
	Paid                  bool
	OriginalURL           string
	AutomaticDebitApplied bool
	Receipt               BoletoReceipt
}

func (m *Storage) RetrieveBoletos() ([]boleto.Boleto, error) {
	nbs := make([]boleto.Boleto, 0)
	for _, b := range m.boletos {
		nb := toBoletoDomain(b)
		nbs = append(nbs, *nb)
	}
	return nbs, nil
}

func (m *Storage) GetBoleto(id string) (*boleto.Boleto, error) {
	if b, ok := m.boletos[id]; ok {
		return toBoletoDomain(b), nil
	}
	return nil, &ErrBoletoNotFound{id}
}

func toBoletoDomain(b Boleto) *boleto.Boleto {
	return &boleto.Boleto{
		Identifier:  b.Identifier,
		Segment:     boleto.Segment(b.Segment),
		Description: b.Description,
		Issuer: boleto.Issuer{
			Name:        b.Issuer.Name,
			FantasyName: b.Issuer.FantasyName,
			LogoURL:     b.Issuer.LogoURL,
			Activity:    b.Issuer.Activity,
			Bank: boleto.IssuerBank{
				BankNumber:  b.Issuer.Bank.BankNumber,
				FantasyName: b.Issuer.Bank.FantasyName,
			},
			Address: b.Issuer.Address,
			Register: boleto.IssuerRegister{
				Type:  b.Issuer.Register.Type,
				Value: b.Issuer.Register.Value,
			},
		},
		Payer: boleto.Payer{
			Name: b.Payer.Name,
			Register: boleto.PayerRegister{
				Type:  b.Payer.Register.Type,
				Value: b.Payer.Register.Value,
			},
		},
		Reason:    b.Reason,
		IssueDate: b.IssueDate,
		DueDate:   b.DueDate,
		Interest:  boleto.Tax(b.Interest),
		Mulct: boleto.Cost{
			Currency: b.Mulct.Currency,
			Value:    b.Mulct.Value,
		},
		Cost: boleto.Cost{
			Currency: b.Cost.Currency,
			Value:    b.Cost.Value,
		},
		BarCode:               b.BarCode,
		Paid:                  b.Paid,
		OriginalURL:           b.OriginalURL,
		AutomaticDebitApplied: b.AutomaticDebitApplied,
	}
}
