package conversion

import (
	"github.com/gin-gonic/gin"
	"github.com/joaohgf/challenge-bravo/internal/api/handler"
	"github.com/joaohgf/challenge-bravo/internal/domain/currency/conversion"
	"github.com/joaohgf/challenge-bravo/internal/repository"
	"github.com/joaohgf/challenge-bravo/internal/repository/models"
	"net/http"
)

type Params struct {
	From   string  `form:"from"`
	To     string  `form:"to"`
	Amount float64 `form:"amount"`
}

type Handler struct {
	domain *conversion.Domain
}

// NewHandler creates a new handler with domain
func NewHandler(repository *repository.Engine) *Handler {
	return &Handler{domain: conversion.NewDomain(repository)}
}

func (h *Handler) Handle(c *gin.Context) {
	var params = new(Params)
	var err = c.ShouldBindQuery(params)
	if err != nil {
		c.JSON(http.StatusBadRequest, handler.MakeResponse(err.Error()))
		return
	}
	result, err := h.domain.Converter(c, params.From, params.To, params.Amount)
	if err != nil {
		c.JSON(http.StatusBadRequest, handler.MakeResponse(err.Error()))
		return
	}
	c.JSON(http.StatusOK, handler.MakeResponse(h.GeneratePayload(result)))
	return
}

func (h *Handler) GeneratePayload(total *float64) map[string]interface{} {
	var result = make(map[string]interface{}, 0)
	result["result"] = total
	result["from"] = h.MakePayload(h.domain.Models.From)
	result["to"] = h.MakePayload(h.domain.Models.To)
	return result
}

func (h *Handler) MakePayload(model *models.Currency) map[string]interface{} {
	return map[string]interface{}{
		"code":      model.Code,
		"price":     model.Price,
		"update_at": model.UpdatedAt,
	}
}
