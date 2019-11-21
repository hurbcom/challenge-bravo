package responsemodel

import (
	"fmt"
	"reflect"
)

// ResponseModel is the api return model
type ResponseModel struct {
	Base            string `json:"base"`
	Date            string `json:"date"`
	TimeLastUpdated int    `json:"time_last_updated"`
	Rates           struct {
		BRL float64 `json:"BRL"`
		AED float64 `json:"AED"`
		ARS float64 `json:"ARS"`
		AUD float64 `json:"AUD"`
		BGN float64 `json:"BGN"`
		BSD float64 `json:"BSD"`
		CAD float64 `json:"CAD"`
		CHF float64 `json:"CHF"`
		CLP float64 `json:"CLP"`
		CNY float64 `json:"CNY"`
		COP float64 `json:"COP"`
		CZK float64 `json:"CZK"`
		DKK float64 `json:"DKK"`
		DOP float64 `json:"DOP"`
		EGP float64 `json:"EGP"`
		EUR float64 `json:"EUR"`
		FJD float64 `json:"FJD"`
		GBP float64 `json:"GBP"`
		GTQ float64 `json:"GTQ"`
		HKD float64 `json:"HKD"`
		HRK float64 `json:"HRK"`
		HUF float64 `json:"HUF"`
		IDR float64 `json:"IDR"`
		ILS float64 `json:"ILS"`
		INR float64 `json:"INR"`
		ISK float64 `json:"ISK"`
		JPY float64 `json:"JPY"`
		KRW float64 `json:"KRW"`
		KZT float64 `json:"KZT"`
		MXN float64 `json:"MXN"`
		MYR float64 `json:"MYR"`
		NOK float64 `json:"NOK"`
		NZD float64 `json:"NZD"`
		PAB float64 `json:"PAB"`
		PEN float64 `json:"PEN"`
		PHP float64 `json:"PHP"`
		PKR float64 `json:"PKR"`
		PLN float64 `json:"PLN"`
		PYG float64 `json:"PYG"`
		RON float64 `json:"RON"`
		RUB float64 `json:"RUB"`
		SAR float64 `json:"SAR"`
		SEK float64 `json:"SEK"`
		SGD float64 `json:"SGD"`
		THB float64 `json:"THB"`
		TRY float64 `json:"TRY"`
		TWD float64 `json:"TWD"`
		UAH float64 `json:"UAH"`
		USD float64 `json:"USD"`
		UYU float64 `json:"UYU"`
		VND float64 `json:"VND"`
		ZAR float64 `json:"ZAR"`
	} `json:"rates"`
}

// ReflectStructField wqqqwqw
func ReflectStructField(Iface interface{}, FieldName string) error {
	ValueIface := reflect.ValueOf(Iface)

	if ValueIface.Type().Kind() != reflect.Ptr {
		ValueIface = reflect.New(reflect.TypeOf(Iface))
	}

	Field := ValueIface.Elem().FieldByName(FieldName)
	if !Field.IsValid() {
		return fmt.Errorf("Interface `%s` does not have the field `%s`", ValueIface.Type(), FieldName)
	}
	return nil
}
