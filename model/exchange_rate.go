package model

type ExchangeRate struct {
	Cube ExchangeRateCube `xml:"Cube>Cube"`
}

type ExchangeRateCube struct {
	Time  string                 `xml:"time,attr"`
	Items []ExchangeRateCubeItem `xml:"Cube"`
}

type ExchangeRateCubeItem struct {
	Currency string `xml:"currency,attr"`
	Rate     string `xml:"rate,attr"`
}
