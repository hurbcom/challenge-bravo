package boleto

type Tax int64

func (t Tax) ToFractional() float64 {
	return float64(t / 100)
}
