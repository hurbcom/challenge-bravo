package handlers

import (
    "github.com/MA-Andrade/challenge-bravo/internals/database"
    "github.com/MA-Andrade/challenge-bravo/internals/models"
    "github.com/gofiber/fiber/v2"
)

func GetCurrencies(c *fiber.Ctx) error {

    err := c.SendString("All Currencies")

    if err != nil {
        return err
    }
    return nil
}

func GetCurrencyFromSymbol(c *fiber.Ctx) error {
    curr := models.Currency{}
    symbol := c.Params("symbol")
    query := `SELECT * FROM currencies WHERE symbol = $1;`

    // initialize connection
    db, err := database.InitializeConnection()
    if err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(&fiber.Map{
            "error":   true,
            "message": err.Error(),
        })

    }
    // query the row with the symbol from the params
    row, err := db.Query(query, symbol)
    defer row.Close()

    if row.Next() {
        switch err := row.Scan(&curr.ID, &curr.Symbol, &curr.Value); err {
        case nil:
            c.Status(fiber.StatusOK).JSON(&fiber.Map{
                "error":    false,
                "message":  nil,
                "currency": curr,
            })
            return nil
        default:
            return c.Status(fiber.StatusInternalServerError).JSON(&fiber.Map{
                "error":   true,
                "message": err.Error(),
            })
        }
    }
    return  c.Status(fiber.StatusNotFound).JSON(&fiber.Map{
    "error":   true,
    "message": err.Error(),
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
    defer foundCurr.Close()

    if foundCurr.Next() {
        return c.Status(fiber.StatusConflict).JSON(&fiber.Map{
                "error":   true,
                "message": "Currency is already in the database",
            })
        }

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

func PutCurrency(c *fiber.Ctx) error {
    err := c.SendString("Update Currency")

    if err != nil {
        return err
    }
    return nil
}

func DeleteCurrency(c *fiber.Ctx) error {
    err := c.SendString("Delete Currency")

    if err != nil {
        return err
    }
    return nil
}
