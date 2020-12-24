package handlers

import (
	"clevergo.tech/jsend"
	"github.com/gin-gonic/gin"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"net/http"
	"strings"
)

func (h *handlers) RemoveCurrency() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		code := strings.ToUpper(ctx.Param("id"))
		if err := h.controller.RemoveCurrency(code); err != nil {
			st, ok := status.FromError(err)
			if ok {
				switch st.Code() {
				case codes.NotFound:
					logError(jsend.Fail(ctx.Writer, currency{Code: "code not found"}, http.StatusNotFound))
					return
				}
			}
			logError(jsend.Error(ctx.Writer, "data has been lost on server", http.StatusInternalServerError))
			return
		}
		logError(jsend.Success(ctx.Writer, nil, http.StatusNoContent))
	}
}
