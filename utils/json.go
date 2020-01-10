package utils

import (
	"io/ioutil"
	"net/http"
)

//GenericJSONMessage returns a generic JSON string
func GenericJSONMessage(status int, message string) string {
	return BuildString(`{"status": `, status, `, "message": "`, message, `"}`)
}

//GenericJSONMessageData returns a generic JSON string with data
func GenericJSONMessageData(status int, payload string) string {
	return BuildString(`{"status": `, status, `, "data": `, payload, `}`)
}

//RequestParse parses JSON data from Request's body
func RequestParse(r *http.Request) ([]byte, error) {
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return nil, err
	}
	return body, nil
}
