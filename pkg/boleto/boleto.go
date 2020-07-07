package boleto

import "time"

type Segment string

var (
	SegmentNormal    = "NORMAL"
	SegmentConvenant = "CONVENANT"
)

type Receipt struct {
	PaymentDate time.Time
	Bank        string
	Value       int64
	Discount    int64
}

type Boleto struct {
	Identifier            string
	Segment               Segment
	Description           string
	Issuer                Issuer
	Payer                 Payer
	Reason                string
	IssueDate             time.Time
	DueDate               time.Time
	Interest              Tax
	Mulct                 Cost
	Cost                  Cost
	BarCode               string
	Paid                  bool
	OriginalURL           string
	AutomaticDebitApplied bool
	Receipt               Receipt
}
