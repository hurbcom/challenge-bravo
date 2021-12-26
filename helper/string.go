package helper

import "unicode"

// IsValidCryptoCode Checks the string if all characters are uppercase or numbers
func IsValidCryptoCode(str string) bool {
	for _, r := range str {
		if !(unicode.IsNumber(r) || (unicode.IsUpper(r) && unicode.IsLetter(r)) || r == '*') {
			return false
		}
	}
	return true
}

// IsLetter Checks the string if all characters are letters
func IsLetter(str string) bool {
	for _, r := range str {
		if !unicode.IsLetter(r) {
			return false
		}
	}
	return true
}
