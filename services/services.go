package services

var API_LAYER_KEY = "JbMGi01jNxQwmyPpdZCsjockGGfhVCWa"
var BASE_URL = "https://api.apilayer.com/fixer/latest?base=USD&symbols=%BRL"

// {
//     "success": true,
//     "timestamp": 1667670063,
//     "base": "USD",
//     "date": "2022-11-05",
//     "rates": {
//         "BRL": 5.044204
//     }
// }

func LayerApiGetRate(toCurrency string) float32 {
	switch toCurrency {
	case "USD":
		return 1.0
	case "BRL":
		return 5.044204
	case "EUR":
		return 5.044204
	default:
		return 1.0
	}
}
