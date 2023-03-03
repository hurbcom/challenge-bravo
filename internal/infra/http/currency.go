package http

import (
	"net/http"
	"os"
	"strconv"
	"strings"

	"github.com/ElladanTasartir/challenge-bravo/internal/application/strategy"
	"github.com/ElladanTasartir/challenge-bravo/internal/application/usecase"
	"github.com/ElladanTasartir/challenge-bravo/internal/domain/errors"
	"github.com/ElladanTasartir/challenge-bravo/internal/infra/cache"
	"github.com/ElladanTasartir/challenge-bravo/internal/infra/client"
	"github.com/ElladanTasartir/challenge-bravo/internal/infra/storage"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

func createCurrency(createCurrencyUseCase *usecase.CreateCurrencyUseCase) func(ctx *gin.Context) {
	return func(ctx *gin.Context) {
		var payload usecase.CurrencyPayload

		if err := ctx.ShouldBind(&payload); err != nil {
			ctx.Error(&errors.UnprocessableError{
				Message: "Payload mismatch",
			})
			return
		}

		if err := validator.New().Struct(&payload); err != nil {
			ctx.JSON(http.StatusBadRequest, FormatValidateErrorMessage(err))
			return
		}

		if payload.Rate <= 0 {
			ctx.Error(&errors.BadRequestError{
				Message: "Rate in USD must be bigger than 0",
			})
			return
		}

		createdCurrency, err := createCurrencyUseCase.CreateCurrency(payload)
		if err != nil {
			ctx.Error(err)
			return
		}

		ctx.JSON(http.StatusCreated, createdCurrency)
		return
	}
}

func deleteCurrency(deleteCurrencyUseCase *usecase.DeleteCurrencyUseCase) func(ctx *gin.Context) {
	return func(ctx *gin.Context) {
		name, sent := ctx.Params.Get("name")
		if !sent {
			ctx.Error(&errors.BadRequestError{
				Message: "Payload mismatch",
			})
			return
		}

		err := deleteCurrencyUseCase.DeleteCurrency(name)
		if err != nil {
			ctx.Error(err)
			return
		}

		ctx.JSON(http.StatusNoContent, nil)
		return
	}
}

func convertCurrency(convertCurrencyUseCase *usecase.ConvertCurrencyUseCase) func(ctx *gin.Context) {
	return func(ctx *gin.Context) {
		from, to, queryValue := ctx.Query("from"), ctx.Query("to"), ctx.Query("amount")

		if from == "" || to == "" {
			ctx.Error(&errors.BadRequestError{
				Message: "Must provide a valid currency to convert FROM and to convert TO",
			})
			return
		}

		amount, err := strconv.ParseFloat(queryValue, 64)
		if err != nil || amount <= 0 {
			ctx.Error(&errors.BadRequestError{
				Message: "Amount must be bigger than 0",
			})
			return
		}

		response, err := convertCurrencyUseCase.ConvertCurrency(from, to, amount)
		if err != nil {
			ctx.Error(err)
			return
		}

		ctx.JSON(http.StatusOK, response)
		return
	}
}

func (server *Server) addCurrencyRoutes() {
	officialCurrencies := strings.Split(os.Getenv("OFFICIAL_CURRENCIES"), ",")

	currencyRepository := storage.NewCurrencyRepository(server.storageClient)
	currencyClient := client.NewCurrencyClient(os.Getenv("CURRENCY_API_URL"))
	currencyCacheRepository := cache.NewCurrencyCacheRepository(server.cacheClient, os.Getenv("REDIS_TTL"))

	officialCurrencyStrategy := strategy.NewOfficialCurrencyStrategy(currencyClient, currencyCacheRepository)
	dynamicCurrencyStrategy := strategy.NewDynamicCurrencyStrategy(currencyRepository, currencyCacheRepository)

	createCurrencyUseCase := usecase.NewCreateCurrencyUseCase(currencyRepository, currencyCacheRepository, officialCurrencies)
	deleteCurrencyUseCase := usecase.NewDeleteCurrencyUseCase(currencyRepository, currencyCacheRepository, officialCurrencies)
	convertCurrencyUseCase := usecase.NewConvertCurrencyUseCase(dynamicCurrencyStrategy, officialCurrencyStrategy, officialCurrencies)

	server.httpServer.POST("/currencies", createCurrency(createCurrencyUseCase))
	server.httpServer.DELETE("/currencies/:name", deleteCurrency(deleteCurrencyUseCase))
	server.httpServer.GET("/currencies/convert", convertCurrency(convertCurrencyUseCase))
}
