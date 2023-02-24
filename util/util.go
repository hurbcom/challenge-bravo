package util

import "math"

func MathRoundPrecision(value float64, precision int) float64 {
	return math.Round(value*(math.Pow10(precision))) / math.Pow10(precision)
}
