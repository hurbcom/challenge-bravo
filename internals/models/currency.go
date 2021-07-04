package models


type Currency struct {
    ID int `db:"id" json:"id" validate:"required"`
    Symbol string `db:"symbol" json:"symbol" validate:"required"`
    Value float64 `db:"value" json:"value" validate:"required,gt=0"`
}

type Currencies struct {
    Currencies []Currency `json:"currencies"`
}