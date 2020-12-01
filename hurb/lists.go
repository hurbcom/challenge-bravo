package hurb

import (
	"encoding/json"
	"fmt"
	"io"
	"os"
	"regexp"
	"strings"
)

type crypto struct {
	ID                int    `json:"id"`
	Symbol            string `json:"symbol"`
	PartnerSymbol     string `json:"partner_symbol"`
	DataAvailableFrom int    `json:"data_available_from"`
}

type regular struct {
	CurrencyName   string `json:"currencyName"`
	CurrencySymbol string `json:"currencySymbol"`
	ID             string `json:"id"`
}

func findRegular(currency string) (bool, error) {
	url := "https://free.currconv.com/api/v7/currencies?apiKey=2af83a1d6b8a29ec3cff"

	body, err := defaultRequest(url)
	if err != nil {
		return false, fmt.Errorf("http.NewRequest err: %v", err)
	}

	output := map[string]regular{}
	body = strings.TrimSuffix(strings.TrimPrefix(body, "{\"results\":"), "}")
	err = json.Unmarshal([]byte(body), &output)
	if err != nil {
		return false, fmt.Errorf("json.Unmarshal err: %v body:%s", err, string(body))
	}
	_, ok := output[strings.ToUpper(currency)]
	if !ok {
		return false, fmt.Errorf("%s currency not supported", currency)
	}
	return true, nil
}

func findCrypto(currency string) (bool, error) {

	url := "https://min-api.cryptocompare.com/data/blockchain/list?api_key=73223fae43e700b98ed621eff903b9e42e3e419d349d7a7be763cd0dbd7ffbe4"

	body, err := defaultRequest(url)
	if err != nil {
		return false, fmt.Errorf("http.NewRequest err: %v", err)
	}

	list, err := parseData(string(body))
	if err != nil {
		return false, err
	}
	_, ok := list[strings.ToUpper(currency)]
	if !ok {
		return false, fmt.Errorf("%s currency not supported: %v", currency, err)
	}

	return true, nil
}

// this parse roundabout was needed because of cryptocompare output format
//
// it outputs the currency list as an object instead of an array,
//
// thus it would require a different struct for each currency
func parseData(body string) (map[string]crypto, error) {
	// first I treat the request output as an string and apply a regexp match
	data := match("\"Data\":(\\{.*\\})}", string(body))
	if len(data) < 2 {
		return map[string]crypto{}, fmt.Errorf("failed to parse request body")
	}

	// then I use a map structure with the currency output format
	parsed := map[string]crypto{}
	err := json.Unmarshal([]byte(data[1]), &parsed)
	if err != nil {
		return map[string]crypto{}, err
	}

	// and it worked
	return parsed, nil
}

func match(exp, text string) []string {
	re := regexp.MustCompile(exp)
	match := re.FindStringSubmatch(text)
	if len(match) < 1 {
		fmt.Printf("Unable to find match for exp %s\n", exp)
		return []string{}
	}
	return match
}

func writeToFile(filename string, data string) error {
	file, err := os.OpenFile(filename, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		return err
	}
	defer file.Close()

	_, err = io.WriteString(file, data)
	if err != nil {
		return err
	}
	return file.Sync()
}
