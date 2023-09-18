const validatorSchemaMiddleware = (schema, properties) => async (req, res, next) => {
  try {
    await schema.validateAsync(req[properties])
    next()
  } catch (error) {
    return res.status(400).json({ error: error.message.replace(/['"]/g, '') })
  }
}

export { validatorSchemaMiddleware }
