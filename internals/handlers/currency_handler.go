package handlers

import (
    "github.com/gofiber/fiber/v2"
)


func GetCurrencies(c *fiber.Ctx) error {

    err := c.SendString("All Currencies")

    if err != nil {
        return err
    }
    return nil
}

func GetCurrency(c *fiber.Ctx) error {
    c.SendString("One Currency")
    err := c.SendString("Single Currency")

    if err != nil {
        return err
    }
    return nil
}

func PostCurrency(c *fiber.Ctx) error {

    err := c.SendString("Add a new Currency")

    if err != nil {
        return err
    }
    return nil
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