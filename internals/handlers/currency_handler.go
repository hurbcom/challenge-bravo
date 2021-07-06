package handlers

import (
    "fmt"
    "github.com/MA-Andrade/challenge-bravo/internals/models"
    "github.com/gofiber/fiber/v2"
    "strconv"
    "strings"
)

func GetCurrencies(c *fiber.Ctx) error {
    currs := models.Currencies{}
    // fetching all the currencies
    if err := currs.GetAllCurrencies(); err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(&fiber.Map{
            "error":   true,
            "message": err.Error(),
        })
    }
    // success response
    c.Status(fiber.StatusOK).JSON(fiber.Map{
        "error":      false,
        "message":    nil,
        "currencies": currs.Currencies,
    })
    return nil
}

func GetCurrencyFromSymbol(c *fiber.Ctx) error {
    // bruteforcing the uppercase for the query
    symbol := strings.ToUpper(c.Params("symbol"))
    curr := models.Currency{}

    if err := curr.GetCurrency(symbol); err != nil {
        errorMsg := fmt.Sprintf("currency %v not found.", symbol)
        return c.Status(fiber.StatusNotFound).JSON(&fiber.Map{
            "error":   true,
            "message": errorMsg,
        })
    }
    return c.Status(fiber.StatusOK).JSON(&fiber.Map{
        "error":    false,
        "message":  nil,
        "currency": curr,
    })
}

func PostCurrency(c *fiber.Ctx) error {
    curr := models.Currency{}

    // parse the body request
    if err := c.BodyParser(&curr); err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(&fiber.Map{
            "error":   true,
            "message": err.Error(),
        })
    }
    // checking if the Symbol length is equals to 3 (including special characters)
    if len([]rune(curr.Symbol)) != 3 {
        return c.Status(fiber.StatusBadRequest).JSON(&fiber.Map{
            "error":   true,
            "message": "currency symbol needs to be exactly 3 characters long.",
        })
    }
    // brute forcing the uppercase on the symbol param
    curr.Symbol = strings.ToUpper(curr.Symbol)
    if err := curr.PostCurrency(); err != nil {
        return c.Status(fiber.StatusConflict).JSON(&fiber.Map{
            "error":   true,
            "message": err.Error(),
        })
    }
    return c.Status(fiber.StatusCreated).JSON(fiber.Map{
        "error":    false,
        "message":  nil,
        "currency": curr,
    })
}

func PutCurrencyFromSymbol(c *fiber.Ctx) error {
    curr := models.Currency{}
    curr.Symbol = strings.ToUpper(c.Params("symbol"))
    // lock usd currency alteration
    if curr.Symbol == "USD" {
        return c.Status(fiber.StatusBadRequest).JSON(&fiber.Map{
            "error":   true,
            "message": "cannot alter the USD currency since it is the baseline currency",
        })
    }
    // parse the body request
    if err := c.BodyParser(&curr); err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(&fiber.Map{
            "error":   true,
            "message": err.Error(),
        })
    }
    // check if the currency value is filled
    if curr.Value == new(models.Currency).Value {
        return c.Status(fiber.StatusBadRequest).JSON(&fiber.Map{
            "error":   true,
            "message": "body missing 'value' parameter",
        })
    }

    // proceed with the put
    if err := curr.PutCurrency(); err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(&fiber.Map{
            "error":   true,
            "message": err.Error(),
        })
    }

    // if the query is successful show the result
    return c.Status(fiber.StatusOK).JSON(&fiber.Map{
        "error":    false,
        "message":  nil,
        "currency": curr,
    })
}

func DeleteCurrencyFromSymbol(c *fiber.Ctx) error {
    curr := models.Currency{}
    curr.Symbol = strings.ToUpper(c.Params("symbol"))

    // lock USD currency alteration
    if curr.Symbol == "USD" {
        return c.Status(fiber.StatusBadRequest).JSON(&fiber.Map{
            "error":   true,
            "message": "cannot delete the USD currency since it is the baseline currency",
        })
    }
    // delete the currency
    if err := curr.DeleteCurrency(); err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(&fiber.Map{
            "error":   true,
            "message": err.Error(),
        })
    }
    // sucess status
    return c.Status(fiber.StatusNoContent).JSON(&fiber.Map{
        "error":   false,
        "message": "currency deleted",
    })
}

func GetConversion(c *fiber.Ctx) error {
    fromCurr := models.Currency{}
    toCurr := models.Currency{}
    // checking for bad numbers in the value
    conversionValue, err := strconv.ParseFloat(c.Params("value"), 64) //64 bits bc crypto curr
    if err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(&fiber.Map{
            "error":   true,
            "message": err.Error(),
        })
    }
    if conversionValue <= 0 {
        return c.Status(fiber.StatusBadRequest).JSON(&fiber.Map{
            "error":   true,
            "message": err.Error(),
        })
    }

    if err = fromCurr.GetCurrency(strings.ToUpper(c.Params("from"))); err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(&fiber.Map{
            "error":   true,
            "message": err.Error(),
        })
    }
    if err = toCurr.GetCurrency(strings.ToUpper(c.Params("to"))); err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(&fiber.Map{
            "error":   true,
            "message": err.Error(),
        })
    }

    // output conversion and response
    outputConversion := conversionValue * fromCurr.Value / toCurr.Value
    return c.Status(fiber.StatusOK).JSON(&fiber.Map{
        "error":           false,
        "message":         "Conversion Successful",
        "converted-value": outputConversion,
    })
}
