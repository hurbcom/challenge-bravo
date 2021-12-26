package helper

import "unicode"

// IsUpper Checks the string if all characters are uppercase or numbers
func IsUpper(str string) bool {
	for _, r := range str {
		if !unicode.IsUpper(r) && (unicode.IsLetter(r) || unicode.IsNumber(r)) {
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
