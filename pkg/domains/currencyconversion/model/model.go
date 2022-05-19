package model

import (
	"challenge-bravo/pkg/domains/currencyconversion/resterror"
	"strings"

	"github.com/pkg/errors"
)

type CurrencyConversion struct {
	ID       string  `json:"id"`
	USDValue float64 `json:"usd_value"`

	Converted      bool    `json:"-"`
	From           string  `json:"-"`
	To             string  `json:"-"`
	Amount         float64 `json:"-"`
	ConvertedValue float64 `json:"-"`
	Error          error   `json:"-"`
}

type ConvertRequest struct {
	From   string  `json:"from"`
	To     string  `json:"to"`
	Amount float64 `json:"amount"`
}

type FindByIDRequest struct {
	ID string `json:"id"`
}

type UpsertRequest struct {
	ID       string  `json:"id"`
	USDValue float64 `json:"usd_value"`
}

type DeleteRequest struct {
	ID string `json:"id"`
}

type JSONResponse struct {
	Converted      bool           `json:"converted"`
	Value          float64        `json:"value"`
	Error          string         `json:"error,omitempty"`
	ConvertRequest ConvertRequest `json:"convert_request"`
}

type CurrencyResponse struct {
	Base   string
	Amount float64
	Result CurrencyResult
}

type CurrencyResult struct {
	Rate float64
	AvailableCurrencies
}

type AvailableCurrencies struct {
	AED float64 `json:"AED"`
	AFN float64 `json:"AFN"`
	ALL float64 `json:"ALL"`
	AMD float64 `json:"AMD"`
	ANG float64 `json:"ANG"`
	AOA float64 `json:"AOA"`
	ARS float64 `json:"ARS"`
	AUD float64 `json:"AUD"`
	AWG float64 `json:"AWG"`
	AZN float64 `json:"AZN"`
	BAM float64 `json:"BAM"`
	BBD float64 `json:"BBD"`
	BDT float64 `json:"BDT"`
	BGN float64 `json:"BGN"`
	BHD float64 `json:"BHD"`
	BIF float64 `json:"BIF"`
	BMD float64 `json:"BMD"`
	BND float64 `json:"BND"`
	BOB float64 `json:"BOB"`
	BRL float64 `json:"BRL"`
	BSD float64 `json:"BSD"`
	BTN float64 `json:"BTN"`
	BWP float64 `json:"BWP"`
	BZD float64 `json:"BZD"`
	CAD float64 `json:"CAD"`
	CDF float64 `json:"CDF"`
	CHF float64 `json:"CHF"`
	CLF float64 `json:"CLF"`
	CLP float64 `json:"CLP"`
	CNH float64 `json:"CNH"`
	CNY float64 `json:"CNY"`
	COP float64 `json:"COP"`
	CUP float64 `json:"CUP"`
	CVE float64 `json:"CVE"`
	CZK float64 `json:"CZK"`
	DJF float64 `json:"DJF"`
	DKK float64 `json:"DKK"`
	DOP float64 `json:"DOP"`
	DZD float64 `json:"DZD"`
	EGP float64 `json:"EGP"`
	ERN float64 `json:"ERN"`
	ETB float64 `json:"ETB"`
	EUR float64 `json:"EUR"`
	FJD float64 `json:"FJD"`
	FKP float64 `json:"FKP"`
	GBP float64 `json:"GBP"`
	GEL float64 `json:"GEL"`
	GHS float64 `json:"GHS"`
	GIP float64 `json:"GIP"`
	GMD float64 `json:"GMD"`
	GNF float64 `json:"GNF"`
	GTQ float64 `json:"GTQ"`
	GYD float64 `json:"GYD"`
	HKD float64 `json:"HKD"`
	HNL float64 `json:"HNL"`
	HRK float64 `json:"HRK"`
	HTG float64 `json:"HTG"`
	HUF float64 `json:"HUF"`
	IDR float64 `json:"IDR"`
	ILS float64 `json:"ILS"`
	INR float64 `json:"INR"`
	IQD float64 `json:"IQD"`
	IRR float64 `json:"IRR"`
	ISK float64 `json:"ISK"`
	JMD float64 `json:"JMD"`
	JOD float64 `json:"JOD"`
	JPY float64 `json:"JPY"`
	KES float64 `json:"KES"`
	KGS float64 `json:"KGS"`
	KHR float64 `json:"KHR"`
	KMF float64 `json:"KMF"`
	KPW float64 `json:"KPW"`
	KRW float64 `json:"KRW"`
	KWD float64 `json:"KWD"`
	KYD float64 `json:"KYD"`
	KZT float64 `json:"KZT"`
	LAK float64 `json:"LAK"`
	LBP float64 `json:"LBP"`
	LKR float64 `json:"LKR"`
	LRD float64 `json:"LRD"`
	LSL float64 `json:"LSL"`
	LYD float64 `json:"LYD"`
	MAD float64 `json:"MAD"`
	MDL float64 `json:"MDL"`
	MGA float64 `json:"MGA"`
	MKD float64 `json:"MKD"`
	MMK float64 `json:"MMK"`
	MNT float64 `json:"MNT"`
	MOP float64 `json:"MOP"`
	MRU float64 `json:"MRU"`
	MUR float64 `json:"MUR"`
	MVR float64 `json:"MVR"`
	MWK float64 `json:"MWK"`
	MXN float64 `json:"MXN"`
	MYR float64 `json:"MYR"`
	MZN float64 `json:"MZN"`
	NAD float64 `json:"NAD"`
	NGN float64 `json:"NGN"`
	NOK float64 `json:"NOK"`
	NPR float64 `json:"NPR"`
	NZD float64 `json:"NZD"`
	OMR float64 `json:"OMR"`
	PAB float64 `json:"PAB"`
	PEN float64 `json:"PEN"`
	PGK float64 `json:"PGK"`
	PHP float64 `json:"PHP"`
	PKR float64 `json:"PKR"`
	PLN float64 `json:"PLN"`
	PYG float64 `json:"PYG"`
	QAR float64 `json:"QAR"`
	RON float64 `json:"RON"`
	RSD float64 `json:"RSD"`
	RUB float64 `json:"RUB"`
	RWF float64 `json:"RWF"`
	SAR float64 `json:"SAR"`
	SCR float64 `json:"SCR"`
	SDG float64 `json:"SDG"`
	SEK float64 `json:"SEK"`
	SGD float64 `json:"SGD"`
	SHP float64 `json:"SHP"`
	SLL float64 `json:"SLL"`
	SOS float64 `json:"SOS"`
	SRD float64 `json:"SRD"`
	SYP float64 `json:"SYP"`
	SZL float64 `json:"SZL"`
	THB float64 `json:"THB"`
	TJS float64 `json:"TJS"`
	TMT float64 `json:"TMT"`
	TND float64 `json:"TND"`
	TOP float64 `json:"TOP"`
	TRY float64 `json:"TRY"`
	TTD float64 `json:"TTD"`
	TWD float64 `json:"TWD"`
	TZS float64 `json:"TZS"`
	UAH float64 `json:"UAH"`
	UGX float64 `json:"UGX"`
	USD float64 `json:"USD"`
	UYU float64 `json:"UYU"`
	UZS float64 `json:"UZS"`
	VND float64 `json:"VND"`
	VUV float64 `json:"VUV"`
	WST float64 `json:"WST"`
	XAF float64 `json:"XAF"`
	XCD float64 `json:"XCD"`
	XDR float64 `json:"XDR"`
	XOF float64 `json:"XOF"`
	XPF float64 `json:"XPF"`
	YER float64 `json:"YER"`
	ZAR float64 `json:"ZAR"`
	ZMW float64 `json:"ZMW"`
}

func NewCurrencyConversion(id string, usdValue float64) (CurrencyConversion, error) {
	if id == "" {
		return CurrencyConversion{}, errors.Wrap(resterror.ErrNew, "empty id")
	}

	if len(id) < 3 {
		return CurrencyConversion{}, errors.Wrap(resterror.ErrNew, "invalid ID, use >= 3 characters")
	}

	return CurrencyConversion{
		ID:       strings.ToUpper(id),
		USDValue: usdValue,
	}, nil
}
