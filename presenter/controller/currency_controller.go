package controller

import (
	"github.com/VictorNapoles/challenge-bravo/presenter/controller/utils"
	"github.com/VictorNapoles/challenge-bravo/usecase"
	"github.com/gin-gonic/gin"
	"net/http"
)

const (
	CodeParameterKey = "code"
)

type (
	CurrencyRequestDto struct {
		Code                  string  `json:"code"`
		CurrencyName          string  `json:"currencyName"`
		UnitValueBankCurrency float64 `json:"unitValueBankCurrency"`
	}

	CurrencyResponsetDto struct {
		Code                  string  `json:"code"`
		CurrencyName          string  `json:"currencyName"`
		UnitValueBankCurrency float64 `json:"unitValueBankCurrency"`
	}
	CurrencyController struct {
		saveCurrency   usecase.SaveCurrency
		deleteCurrency usecase.DeleteCurrency
	}
)

func NewCurrencyController(saveCurrency usecase.SaveCurrency, deleteCurrency usecase.DeleteCurrency) *CurrencyController {
	return &CurrencyController{saveCurrency: saveCurrency, deleteCurrency: deleteCurrency}
}

// @BasePath /api/v1
// SaveCurrency
// @Tags         currency
// @Summary Save a new currency
// @Schemes CurrencyRequestDto
// @Description Save a new currency
// @Produce json
// @Param data body CurrencyRequestDto true "The input currency struct"
// @Success 201 {object} CurrencyResponsetDto
// @Failure 422
// @Failure 500
// @Router /currency [post]
func (q *CurrencyController) Save(c *gin.Context) {
	var req CurrencyRequestDto
	err := c.ShouldBindJSON(&req)

	if err != nil {
		utils.HandleError(c, err)
		return
	}

	currency, err := q.saveCurrency.Execute(&usecase.SaveCurrencyDto{
		Code:                  req.Code,
		CurrencyName:          req.CurrencyName,
		UnitValueBankCurrency: req.UnitValueBankCurrency,
	})

	if err != nil {
		utils.HandleError(c, err)
		return
	}

	c.JSON(http.StatusCreated, &CurrencyResponsetDto{
		Code:                  currency.Code,
		CurrencyName:          currency.CurrencyName,
		UnitValueBankCurrency: currency.UnitValueBankCurrency,
	})
}

// DeleteCurrency
// @Tags         currency
// @Summary Delete a currency
// @Param code path string true "The code of a currency"
// @Description Delete a currency
// @Success 200 {string} Currency deleted successfully
// @Failure 422
// @Failure 500
// @Router /currency/{code} [delete]
func (q *CurrencyController) Delete(c *gin.Context) {

	code := c.Param(CodeParameterKey)
	err := q.deleteCurrency.Execute(&usecase.DeleteCurrencyDto{CurrencyCode: code})
	if err != nil {
		utils.HandleError(c, err)
		return
	}

	c.JSON(http.StatusOK, "Currency deleted successfully")
}
