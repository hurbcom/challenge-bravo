package handlers

import (
    "database/sql"
    "fmt"
    "github.com/MA-Andrade/challenge-bravo/internals/database"
    "github.com/MA-Andrade/challenge-bravo/internals/models"
    "github.com/gofiber/fiber/v2"
    "strconv"
)

func GetCurrencies(c *fiber.Ctx) error {
    currs := models.Currencies{}
    query := `SELECT id, symbol, value FROM currencies;`

    // initialize connection
    db, err := database.InitializeConnection()
    if err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(&fiber.Map{
            "error":   true,
            "message": err.Error(),
        })

    }
    // execute selection
    resultSet, err := db.Query(query)
    if err != nil {
        c.Status(fiber.StatusInternalServerError).JSON(&fiber.Map{
            "error": true,
            "message": err.Error(),
        })
    }
    defer resultSet.Close()
    // iterate over resultset
    for resultSet.Next() {
        curr := models.Currency{}
        // scanning into objects
        err = resultSet.Scan(&curr.ID, &curr.Symbol, &curr.Value)
        // complex error handling (can be empty with no error thrown)
        switch err {
        case sql.ErrNoRows:
            return c.Status(fiber.StatusNotFound).JSON(&fiber.Map{
                "error": true,
                "message": "currencies table is empty",
            })
        default:
            return c.Status(fiber.StatusInternalServerError).JSON(&fiber.Map{
                "error": true,
                "message": err.Error(),
            })
        case nil:
        }
        // appending to collection
        currs.Currencies = append(currs.Currencies, curr)
    }
    // success response
    return c.Status(fiber.StatusOK).JSON(fiber.Map{
        "error": false,
        "message": nil,
        "currencies": currs.Currencies,
    })

}

func GetCurrencyFromSymbol(c *fiber.Ctx) error {
    symbol := c.Params("symbol")
    curr := models.Currency{}
    query := `SELECT id, symbol, value FROM currencies WHERE symbol = $1;`

    // initialize connection
    db, err := database.InitializeConnection()
    if err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(&fiber.Map{
            "error":   true,
            "message": err.Error(),
        })

    }
    // query the row with the symbol from the params
    row := db.QueryRow(query, symbol)
    // error handling for no row (no error thrown)
    switch err := row.Scan(&curr.ID, &curr.Symbol, &curr.Value); err {
    case sql.ErrNoRows:
        errorMsg := fmt.Sprintf("currency: %v not found.", symbol)
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

    // initialize connection
    db, err := database.InitializeConnection()
    if err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(&fiber.Map{
            "error":   true,
            "message": err.Error(),
        })
    }

    // check if currency exists
    foundCurr, err := db.Query("SELECT * FROM currencies WHERE symbol = $1;", curr.Symbol)
    if err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(&fiber.Map{
            "error":   true,
            "message": err.Error(),
        })
    }
    defer foundCurr.Close()
    // check if there is a row in the resultset
    if foundCurr.Next() {
        return c.Status(fiber.StatusConflict).JSON(&fiber.Map{
            "error":   true,
            "message": "currency is already in the database",
        })
    }
    // inserting
    query := "INSERT INTO currencies (symbol, value) VALUES ($1, $2) RETURNING id"
    if err = db.QueryRow(query, curr.Symbol, curr.Value).Scan(&curr.ID); err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(&fiber.Map{
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
    curr.Symbol = c.Params("symbol")

    query := `UPDATE currencies set value = $1 WHERE symbol = $2;`

    // parse the body request
    if err := c.BodyParser(&curr); err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(&fiber.Map{
            "error":   true,
            "message": err.Error(),
        })
    }

    // initialize connection
    db, err := database.InitializeConnection()
    if err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(&fiber.Map{
            "error":   true,
            "message": err.Error(),
        })
    }

    // check if currency exists
    foundCurr, err := db.Query(`SELECT * FROM currencies WHERE symbol = $1;`, curr.Symbol)
    if err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(&fiber.Map{
            "error":   true,
            "message": err.Error(),
        })
    }
    defer foundCurr.Close()

    // if the record is found proceed for the put
    if foundCurr.Next() {
        // write the db
        if _, err = db.Query(query, curr.Value, curr.Symbol); err != nil {
            return c.Status(fiber.StatusInternalServerError).JSON(&fiber.Map{
                "error":   true,
                "message": err.Error(),
            })
        }

        // if the query is successful show the result
        return c.Status(fiber.StatusCreated).JSON(fiber.Map{
            "error":    false,
            "message":  nil,
            "currency": curr,
        })
    }

    // currency is not found
    errorMsg := fmt.Sprintf("currency not found: %v", curr)
    return c.Status(fiber.StatusNotFound).JSON(&fiber.Map{
        "error":   true,
        "message": errorMsg,
    })
}

func DeleteCurrencyFromSymbol(c *fiber.Ctx) error {
    currSymbol := c.Params("symbol")
    query := `DELETE FROM currencies WHERE symbol = $1 RETURNING *;`

    // initialize connection
    db, err := database.InitializeConnection()
    if err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(&fiber.Map{
            "error":   true,
            "message": err.Error(),
        })
    }
    // executing the delete query
    affectedRow, err := db.Query(query, currSymbol)
    if err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(&fiber.Map{
            "error":   true,
            "message": err.Error(),
        })
    }
    // check if the deletion was successful (returned the deleted row)
    if !affectedRow.Next() {
        errorMsg := fmt.Sprintf("currency: %v not found.", currSymbol)
        return c.Status(fiber.StatusNotFound).JSON(&fiber.Map{
            "error":   true,
            "message": errorMsg,
        })
    }

    // sucess status
    return c.Status(fiber.StatusNoContent).JSON(&fiber.Map{
        "error":   false,
        "message": "currency deleted",
    })
}

func GetConversion(c *fiber.Ctx) error {
    var errorMsg string
    fromCurr := models.Currency{}
    toCurr := models.Currency{}

    fromCurr.Symbol = c.Params("from")
    toCurr.Symbol = c.Params("to")

    query := `SELECT value FROM currencies WHERE symbol = $1;`

    // checking for bad numbers
    conversionValue, err := strconv.ParseFloat(c.Params("value"), 64) //64 bits bc crypto curr
    if err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(&fiber.Map{
            "error":   true,
            "message": err.Error(),
        })
    }

    // initialize connection
    db, err := database.InitializeConnection()
    if err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(&fiber.Map{
            "error":   true,
            "message": err.Error(),
        })
    }

    // check if from currency exists
    foundCurr := db.QueryRow(query, fromCurr.Symbol)
    if err = foundCurr.Scan(&fromCurr.Value); err != nil {
        errorMsg = fmt.Sprintf("Currency: %v not found. : %v", fromCurr.Symbol, err.Error())
        return c.Status(fiber.StatusNotFound).JSON(&fiber.Map{
            "error":   true,
            "message": errorMsg,
        })
    }

    // check if from currency exists
    foundCurr = db.QueryRow(query, toCurr.Symbol)
    if err = foundCurr.Scan(&toCurr.Value); err != nil {
        errorMsg = fmt.Sprintf("Currency: %v not found. : %v", toCurr.Symbol, err.Error())
        return c.Status(fiber.StatusNotFound).JSON(&fiber.Map{
            "error":   true,
            "message": errorMsg,
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
