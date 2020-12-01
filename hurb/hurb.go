package hurb

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"
	"strings"

	"github.com/gorilla/mux"
)

var (
	// these urls includes the personal api keys for test only
	endpoints = map[string]endpoint{
		"crypto":  {name: "crypto", url: "https://min-api.cryptocompare.com/data/price?q=USD_BRL&compact=y&callback=jQuery20306565551548947455_1606228616530&_=1606228616531&fsym=%s&tsyms=USD&api_key=73223fae43e700b98ed621eff903b9e42e3e419d349d7a7be763cd0dbd7ffbe4"},
		"regular": {name: "currconv", url: "https://free.currconv.com/api/v7/convert?q=%s_USD&compact=ultra&apiKey=%v"},
	}
	errList       = []error{}
	defaultAPIKey = "3d5e872f50dc9748fe08"
)

type args map[string]interface{}

type currency struct {
	name   string
	crypto bool
}

type endpoint struct {
	url  string
	name string
}

// StartServer starts the hurb-challenge test suite
func StartServer() error {
	log.Println("starting")
	r := mux.NewRouter()
	log.Println("new router")
	r.HandleFunc("/exchange", exchange).Methods("GET")
	r.HandleFunc("/add", addCurrency).Methods("GET")
	r.HandleFunc("/rm", rmCurrency).Methods("GET")
	if len(errList) > 0 {
		errOutput := ""
		for i := range errList {
			errOutput += fmt.Sprintf("\nexchange err %d: %v", i, errList[i])
		}
		return fmt.Errorf(errOutput)
	}
	http.Handle("/", r)
	log.Fatal(http.ListenAndServe(":8888", nil))
	return nil
}

func rmCurrency(w http.ResponseWriter, r *http.Request) {
	log.Println("starting rm currency flow")
	currValue := r.FormValue("currency")
	if len(currValue) == 0 {
		w.Write(errJSON(fmt.Errorf("invalid currency; cannot be empty")))
		return
	}
	m, err := newMongoClient()
	if err != nil {
		m.close()
		w.Write(errJSON(fmt.Errorf("newMongoClient err: %v", err)))
		return
	}
	defer m.close()
	err = m.rmCurr(currency{name: currValue})
	if err != nil {
		w.Write(errJSON(err))
		return
	}
	w.Write(successJSON(fmt.Sprintf("successfully removed %s currency from support list", currValue)))
}

func addCurrency(w http.ResponseWriter, r *http.Request) {
	args, err := addCurrArgs(r)
	if err != nil {
		w.Write(errJSON(err))
		return
	}
	currList, err := supportedCurrencies()
	if err != nil {
		w.Write(errJSON(err))
		return
	}
	_, ok := currList[args.name]
	if ok {
		w.Write(successJSON(fmt.Sprintf("%s currency already supported", args.name)))
		return
	}

	found, err := false, fmt.Errorf("")

	currType := "regular"
	if args.crypto {
		found, err = findCrypto(args.name)
		currType = "crypto"
	} else {
		found, err = findRegular(args.name)
	}
	if err != nil {
		w.Write(errJSON(err))
		return
	}

	if !found {
		w.Write(errJSON(fmt.Errorf("unable to support %s %s currency", currType, args.name)))
		return
	}
	m, err := newMongoClient()
	defer m.close()
	if err != nil {
		w.Write(errJSON(fmt.Errorf("newMongoClient err: %v", err)))
		return
	}

	err = m.addCurr(args)
	if err != nil {
		w.Write(errJSON(fmt.Errorf("addCurr err: %v", err)))
		return
	}

	w.Write(successJSON(fmt.Sprintf("%s %s currency succesfully added to support list", currType, args.name)))
}

func exchange(w http.ResponseWriter, r *http.Request) {
	log.Printf("starting exchange request")
	argList, err := exchangeArgs(r)
	if err != nil {
		w.Write(errJSON(err))
		errList = append(errList, err)
		return
	}

	fromUSDRatio, toUSDRatio := float64(1), float64(1)

	if strings.ToLower(toString(argList["from"])) != "usd" {
		fromUSDRatio, err = currencyToUSD(args{
			"currency": argList["from"],
			"url":      argList["url"],
			"key":      argList["key"],
		})
		if err != nil {
			w.Write(errJSON(err))
			errList = append(errList, err)
			return
		}
	}

	if strings.ToLower(toString(argList["to"])) != "usd" {
		toUSDRatio, err = currencyToUSD(args{
			"currency": argList["to"],
			"url":      argList["url"],
			"key":      argList["key"],
		})
		if err != nil {
			w.Write(errJSON(err))
			errList = append(errList, err)
			return
		}
	}

	log.Printf("from %s to usd ratio:%.2f\n", argList["from"], fromUSDRatio)
	log.Printf("to   %s to usd ratio:%.2f\n", argList["to"], toUSDRatio)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(exchangeOutput(
		strings.ToUpper(toString(argList["from"])),
		strings.ToUpper(toString(argList["to"])),
		fromUSDRatio/toUSDRatio), // converts to desired ratio
	)
	log.Printf("successfully converted currencies")
}

// currencyToUSD converts from the desired currency to USD
func currencyToUSD(args args) (float64, error) {
	log.Printf("starting %s to usd exchange", args["currency"])
	inputCurrency := strings.ToUpper(toString(args["currency"]))

	if inputCurrency == "USD" {
		return float64(1), nil
	}
	currList, err := supportedCurrencies()
	if err != nil {
		return float64(0), err
	}
	isCrypto := currList[inputCurrency].crypto

	endpoint := endpoints["regular"]
	url := fmt.Sprintf(endpoint.url, inputCurrency, args["key"])
	if isCrypto {
		endpoint = endpoints["crypto"]
		url = fmt.Sprintf(endpoint.url, inputCurrency)
	}

	log.Printf("fetching %s to usd ratio from %s endpoint", inputCurrency, strings.ToLower(endpoint.name))

	body, err := defaultRequest(url)
	if err != nil {
		return float64(0), fmt.Errorf("http.NewRequest err: %v", err)
	}

	type out interface{}
	jsonData := map[string]out{}
	err = json.Unmarshal([]byte(body), &jsonData)
	if err != nil {
		return float64(0), fmt.Errorf("json.Unmarshal err: %v\nbody:%s", err, string(body))
	}

	outputKey := strings.ToUpper(fmt.Sprintf("%s_USD", inputCurrency))
	if isCrypto {
		outputKey = "USD"
	}
	_, ok := jsonData[outputKey]
	if !ok {
		_, ok = jsonData["error"]
		if ok {
			return float64(0), fmt.Errorf("failed to parse %s output: %v", endpoint.name, jsonData["error"])
		}
		return float64(0), fmt.Errorf("failed to parse %s output: %s", endpoint.name, body)
	}

	output, err := strconv.ParseFloat(toString(jsonData[outputKey]), 64)
	if err != nil {
		return float64(0), fmt.Errorf("strconv.ParseFloat err: %v", err)
	}
	return output, nil
}

func errJSON(err error) []byte {
	return []byte(fmt.Sprintf("{\"error\":\"%v\"}", err))
}

func successJSON(output string) []byte {
	return []byte(fmt.Sprintf("{\"success\":\"%v\"}", output))
}

func exchangeOutput(from, to string, value float64) []byte {
	return []byte(fmt.Sprintf("{\"%s_%s\":%.2f}", from, to, value))
}

func addCurrArgs(r *http.Request) (currency, error) {
	log.Printf("validating currencies query arguments")
	currName := r.FormValue("currency")
	if len(currName) == 0 {
		return currency{}, fmt.Errorf("invalid 'currency' value; cannot be empty")
	}
	output := currency{
		name: currName,
	}

	strIsCrypto := r.FormValue("isCrypto")
	if len(strIsCrypto) == 0 {
		return currency{}, fmt.Errorf("invalid 'isCrypto' value; cannot be empty")
	}
	isCrypto, err := strconv.ParseBool(strIsCrypto)
	if err != nil {
		return currency{}, fmt.Errorf("invalid 'isCrypto' value; must be 'true' or 'false': %v", err)
	}
	output.crypto = isCrypto

	return output, nil
}

func exchangeArgs(r *http.Request) (args, error) {
	log.Printf("validating exchange query arguments")
	from := r.FormValue("from")
	if len(from) == 0 {
		return args{}, fmt.Errorf("invalid 'from' value; cannot be empty")
	}

	currList, err := supportedCurrencies()
	if err != nil {
		return args{}, err
	}

	_, ok := currList[strings.ToUpper(from)]
	if !ok {
		return args{}, fmt.Errorf("%s currency not supported", from)
	}
	output := args{"from": from}
	log.Printf("valid 'from'")

	to := r.FormValue("to")
	if len(to) == 0 {
		return args{}, fmt.Errorf("invalid 'to' value; cannot be empty")
	}
	_, ok = currList[strings.ToUpper(to)]
	if !ok {
		return args{}, fmt.Errorf("%s currency not supported", to)
	}
	output["to"] = to
	log.Printf("valid 'to'")

	strAmount := r.FormValue("amount")
	if len(strAmount) == 0 {
		return args{}, fmt.Errorf("invalid 'amount' value; cannot be empty")
	}
	amount, err := strconv.ParseFloat(strAmount, 64)
	if err != nil {
		return args{}, fmt.Errorf("invalid amount format: %v", err)
	}
	output["amount"] = amount
	log.Printf("valid 'amount'")

	apiKey := r.FormValue("key")
	if len(apiKey) == 0 {
		log.Println("using default currconv api key")
		apiKey = defaultAPIKey
	}
	output["key"] = apiKey

	return output, nil
}

func supportedCurrencies() (map[string]currency, error) {
	m, err := newMongoClient()
	if err != nil {
		return map[string]currency{}, err
	}
	defer m.close()
	return m.listCurr()
}

func toString(i interface{}) string {
	return fmt.Sprint(i)
}

func defaultRequest(url string) (string, error) {
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return "", fmt.Errorf("http.NewRequest err: %v", err)
	}

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return "", fmt.Errorf("http.DefaultClient.Do err: %v", err)
	}

	defer res.Body.Close()
	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return "", fmt.Errorf("ioutil.ReadAll err: %v", err)
	}

	return string(body), nil
}
