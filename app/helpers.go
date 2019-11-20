package app

import (
	"encoding/json"
	"fmt"
	"net/http"
)

//Write to response with status code
func Write(w http.ResponseWriter, status int, text string) {
	WriteBytes(w, status, []byte(text))
}

//WriteJSON to the response and with the status code
func WriteJSON(w http.ResponseWriter, status int, body map[string]interface{}) {
	bts, _ := json.Marshal(body)
	WriteBytes(w, status, bts)
}

//WriteBytes to the response and with the status code
func WriteBytes(w http.ResponseWriter, status int, text []byte) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	w.Write(text)
}

// WriteError to the response with message and log error message
func WriteError(w http.ResponseWriter, status int, errorMsg string, err error) {
	errMsg := fmt.Sprintf(`{"success":false, "message":"%s", "reason": "%s"}`, errorMsg, err.Error())
	Write(w, status, errMsg)
}

// WriteErrorWithJSON sends a response with status error and log error msg
func WriteErrorWithJSON(w http.ResponseWriter, status int, res []byte, msg string) {
	retMsg := fmt.Sprintf(`{"success" : false, "response":%s}`, res)
	Write(w, status, retMsg)
}

// WriteSuccessWithJSON sends response with statusOK to request and log success msg
func WriteSuccessWithJSON(w http.ResponseWriter, status int, res []byte, msg string) {
	retMsg := fmt.Sprintf(`{"success" : true, "response":%s}`, res)
	Write(w, status, retMsg)
}
