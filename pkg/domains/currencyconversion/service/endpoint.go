package service

import (
	"context"

	"challenge-bravo/pkg/domains/currencyconversion/model"
	"challenge-bravo/pkg/domains/currencyconversion/resterror"

	"github.com/go-kit/kit/endpoint"
	"github.com/pkg/errors"
)

func Convert(svc ServiceI) endpoint.Endpoint {
	return func(ctx context.Context, request interface{}) (interface{}, error) {
		req, ok := request.(model.ConvertRequest)
		if !ok {
			return nil, errors.Wrap(resterror.ErrTypeAssertion, "cannot convert request->ConvertRequest")
		}

		q, err := svc.Convert(ctx, req)
		if err != nil {
			return nil, err
		}

		return q.ToJSONResponse(), nil
	}
}

func FindByID(svc ServiceI) endpoint.Endpoint {
	return func(ctx context.Context, request interface{}) (interface{}, error) {
		req, ok := request.(model.FindByIDRequest)
		if !ok {
			return nil, errors.Wrap(resterror.ErrTypeAssertion, "cannot convert request->ConvertRequest")
		}

		q, err := svc.FindByID(ctx, req.ID)
		if err != nil {
			return nil, err
		}

		return q, nil
	}
}

func ListCurrencies(svc ServiceI) endpoint.Endpoint {
	return func(ctx context.Context, request interface{}) (interface{}, error) {
		qs, err := svc.ListCurrencies(ctx)
		if err != nil {
			return nil, err
		}
		return qs, nil
	}
}

func Upsert(svc ServiceI) endpoint.Endpoint {
	return func(ctx context.Context, request interface{}) (interface{}, error) {
		req, ok := request.(model.UpsertRequest)
		if !ok {
			return nil, errors.Wrap(resterror.ErrTypeAssertion, "cannot convert request->UpsertRequest")
		}

		q, err := model.NewCurrencyConversion(req.ID, req.USDValue)
		if err != nil {
			return nil, err
		}

		if err := svc.Upsert(ctx, &q); err != nil {
			return nil, err
		}
		return q, nil
	}
}

func DeleteByID(svc ServiceI) endpoint.Endpoint {
	return func(ctx context.Context, request interface{}) (interface{}, error) {
		req, ok := request.(model.DeleteRequest)
		if !ok {
			return nil, errors.Wrap(resterror.ErrTypeAssertion, "cannot convert request->Delete")
		}

		err := svc.Delete(ctx, req.ID)
		return nil, err
	}
}
