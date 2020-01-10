package utils

import (
	"fmt"
	"strings"
)

//BuildString glues all the pieces and returns a string
func BuildString(strs ...interface{}) string {
	var sb strings.Builder
	for _, str := range strs {
		sb.WriteString(fmt.Sprintf("%v", str))
	}
	return sb.String()
}
