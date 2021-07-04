package models


type Currency struct {
    ID int `database:"id" json:"id"`
    Symbol string `database:"symbol" json:"symbol" validate:"required"`
    Value float64 `database:"value" json:"value" validate:"required,gt=0"`
}

type Currencies struct {
    Currencies []Currency `json:"currencies"`
}