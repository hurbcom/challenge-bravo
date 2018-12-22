package util

import "fmt"

func FormatAddress(host string, port int) string {
	return fmt.Sprintf("%s:%d", host, port)
}
