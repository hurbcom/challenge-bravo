package transport

import (
	"challenge-bravo/pkg/domains/currencyconversion/model"
	"challenge-bravo/pkg/domains/currencyconversion/resterror"
	"challenge-bravo/pkg/domains/currencyconversion/service"
	"context"
	"encoding/json"
	"log"
	stdHTTP "net/http"
	"strconv"

	chi "github.com/go-chi/chi/v5"
	"github.com/go-kit/kit/transport/http"
	"github.com/pkg/errors"
)

func NewHTTPHandler(svc service.ServiceI) stdHTTP.Handler {
	options := []http.ServerOption{
		http.ServerErrorEncoder(errorHandler),
	}

	convert := http.NewServer(
		service.Convert(svc),
		decodeConvertRequest,
		codeHTTP{200}.encodeResponse,
		options...,
	)

	list := http.NewServer(
		service.ListCurrencies(svc),
		decodeListRequest,
		codeHTTP{200}.encodeResponse,
		options...,
	)

	find := http.NewServer(
		service.FindByID(svc),
		decodeFindRequest,
		codeHTTP{200}.encodeResponse,
		options...,
	)

	upsert := http.NewServer(
		service.Upsert(svc),
		decodeUpsertRequest,
		codeHTTP{200}.encodeResponse,
		options...,
	)

	delete := http.NewServer(
		service.DeleteByID(svc),
		decodeDeleteRequest,
		func(ctx context.Context, w stdHTTP.ResponseWriter, response interface{}) error {
			return nil
		},
		options...,
	)

	r := chi.NewRouter()

	r.Get("/convert", convert.ServeHTTP)
	r.Get("/custom", list.ServeHTTP)
	r.Get("/{id}", find.ServeHTTP)
	r.Post("/", upsert.ServeHTTP)
	r.Delete("/{id}", delete.ServeHTTP)
	return r
}

func decodeConvertRequest(_ context.Context, r *stdHTTP.Request) (interface{}, error) {
	amount, err := strconv.ParseFloat(r.FormValue("amount"), 64)
	if err != nil {
		return nil, errors.Wrap(resterror.ErrConvertAmount, err.Error())
	}
	return model.ConvertRequest{
		From:   r.FormValue("from"),
		To:     r.FormValue("to"),
		Amount: amount,
	}, nil
}

func decodeFindRequest(_ context.Context, r *stdHTTP.Request) (interface{}, error) {
	return model.FindByIDRequest{
		ID: chi.URLParam(r, "id"),
	}, nil
}

func decodeListRequest(_ context.Context, r *stdHTTP.Request) (interface{}, error) {
	return nil, nil
}

func decodeUpsertRequest(_ context.Context, r *stdHTTP.Request) (interface{}, error) {
	req := model.UpsertRequest{}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		return nil, err
	}
	return req, nil
}

func decodeDeleteRequest(_ context.Context, r *stdHTTP.Request) (interface{}, error) {
	return model.DeleteRequest{
		ID: chi.URLParam(r, "id"),
	}, nil
}

// codeHTTP encodes the default HTTP code. if you have/need to handle more status
// codes create your own EncodeResponseFunc.
type codeHTTP struct {
	int
}

func (c codeHTTP) encodeResponse(_ context.Context, w stdHTTP.ResponseWriter, input interface{}) error {
	w.Header().Set("Content-type", "application/json; charset=UTF-8")
	w.WriteHeader(c.int)
	return json.NewEncoder(w).Encode(input)
}

func errorHandler(_ context.Context, err error, w stdHTTP.ResponseWriter) {
	resp, code := resterror.RESTErrorBussines.ErrorProcess(err)

	w.WriteHeader(code)
	if err := json.NewEncoder(w).Encode(map[string]string{"error": resp}); err != nil {
		log.Printf("Encoding error, nothing much we can do: %v", err)
	}
}
