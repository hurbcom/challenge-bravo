package util

import (
	"encoding/json"
	"github.com/pkg/errors"
	"io/ioutil"
	"log"
	"net/http"
)

func GetAndParseJSON(url string, structPointer interface{}) error {
	spaceClient := http.Client{}
	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		return err
	}
	res, getErr := spaceClient.Do(req)
	if getErr != nil {
		return err
	}
	if res.StatusCode != 200 {
		return errors.New("Error retrieving data: " + res.Status)
	}
	body, readErr := ioutil.ReadAll(res.Body)
	if readErr != nil {
		log.Fatal(readErr)
	}
	return json.Unmarshal(body, structPointer)
}
