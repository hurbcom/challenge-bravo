export function validateSchema(schema) {
    return (req, res, next) => {
        const validation = schema.validate(req.body)

        if(validation.error) {
            throw { type: 'unprocessable_entity', message: validation.error.message }
        }
        
        next()
    }
}