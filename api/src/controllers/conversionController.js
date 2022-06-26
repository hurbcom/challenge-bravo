const {
  createConversionService,
  ConversionInvalidDataError,
  ConversionCurrencyNotFoundError,
} = require('../services/conversionService')

function createConversionController() {
  const conversionService = createConversionService()
  return {
    async findOne(ctx) {
      try {
        const data = ctx.request.query
        const conversion = await conversionService.findOne(data)
        ctx.body = { data: conversion }
        ctx.status = 200
      } catch (err) {
        if (
          err instanceof ConversionInvalidDataError ||
          err instanceof ConversionCurrencyNotFoundError
        ) {
          ctx.body = {
            data: null,
            error: err.message,
          }
          ctx.status = 422
        } else {
          throw err
        }
      }
    },
  }
}

module.exports = { createConversionController }
