package handlers

import (
	"clevergo.tech/jsend"
	"encoding/json"
	"github.com/gin-gonic/gin"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"io/ioutil"
	"net/http"
	"strings"
)

type currency struct {
	Code string `json:"code"`
}

func (h *handlers) AddCurrency() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		body, err := ioutil.ReadAll(ctx.Request.Body)
		if err != nil {
			logError(jsend.Error(ctx.Writer, "data has been lost on server", http.StatusInternalServerError))
			return
		}
		var currncy currency
		if err := json.Unmarshal(body, &currncy); err != nil {
			if _, ok := err.(*json.UnmarshalTypeError); ok {
				logError(jsend.Fail(ctx.Writer, currency{Code: "code has a invalid type"}, http.StatusBadRequest))
				return
			}
			logError(err)
			logError(jsend.Error(ctx.Writer, "data has been lost on server", http.StatusInternalServerError))
			return
		}
		if currncy.Code == "" {
			logError(jsend.Fail(ctx.Writer, currency{Code: "code is a required field"}, http.StatusBadRequest))
			return
		}
		currncy.Code = strings.ToUpper(currncy.Code)
		if err := h.controller.AddCurrency(currncy.Code); err != nil {
			st, ok := status.FromError(err)
			if ok {
				switch st.Code() {
				case codes.AlreadyExists:
					logError(jsend.Fail(ctx.Writer, currency{Code: "code already exist"}, http.StatusBadRequest))
					return
				case codes.InvalidArgument:
					logError(jsend.Fail(ctx.Writer, currency{Code: "code is invalid"}, http.StatusBadRequest))
					return
				}
			}
			logError(jsend.Error(ctx.Writer, "data has been lost on server", http.StatusInternalServerError))
			return
		}
		logError(jsend.Success(ctx.Writer, currncy, http.StatusCreated))
	}
}
