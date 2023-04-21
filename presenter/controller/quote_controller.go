package controller

import (
	"github.com/VictorNapoles/challenge-bravo/presenter/controller/utils"
	"github.com/VictorNapoles/challenge-bravo/usecase"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
)

const (
	FromParameterKey   = "from"
	ToParameterKey     = "to"
	AmountParameterKey = "amount"
)

type (
	QuoteResponseDto struct {
		From   string  `json:"from"`
		To     string  `json:"to"`
		Name   string  `json:"name"`
		Amount float64 `json:"amount"`
	}
	QuoteController struct {
		getQuote usecase.GetQuote
	}
)

func NewQuoteController(getQuote usecase.GetQuote) *QuoteController {
	return &QuoteController{getQuote: getQuote}
}

// GetQuote
// @Tags         quote
// @Summary Get a quote between two currency
// @Param from query string true "Currency from"
// @Param to query string true "Currency to"
// @Param amount query float64 true "Currency from amount"
// @Description Get a quote between two currency
// @Produce json
// @Success 201 {object} QuoteResponseDto
// @Failure 422
// @Failure 500
// @Router /quote [get]
func (q *QuoteController) Get(c *gin.Context) {
	from := c.Query(FromParameterKey)
	to := c.Query(ToParameterKey)
	amount, err := strconv.ParseFloat(c.Query(AmountParameterKey), 64)

	if err != nil {
		utils.HandleError(c, err)
	}

	quote, err := q.getQuote.Execute(&usecase.GetQuoteDto{
		From:   from,
		To:     to,
		Amount: float64(amount),
	})

	if err != nil {
		utils.HandleError(c, err)
	}

	c.JSON(http.StatusOK, &QuoteResponseDto{
		From:   quote.From,
		To:     quote.To,
		Name:   quote.Name,
		Amount: quote.Amount,
	})
}
