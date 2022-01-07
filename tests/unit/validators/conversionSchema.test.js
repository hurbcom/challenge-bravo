import conversionSchema from '../../../src/validators/conversionSchema.js'

describe('Test validate Conversion Schema', () => {
    test('Test validation with success ', async () => {
        const query = {
            from: 'USD',
            to: 'BRL',
            amount: 10
        }

        const responseValidateSchema = await conversionSchema.validate(query)

        await expect(responseValidateSchema).toHaveProperty(['from'])
        await expect(responseValidateSchema).toHaveProperty(['to'])
        await expect(responseValidateSchema).toHaveProperty(['amount'])
    })

    test('Test validation with error on format without from field', async () => {
        const body = {
            to: 'BRL',
            amount: 10
        }

        await expect(conversionSchema.validate(body)).rejects.toThrow("The 'from' field is required")
    })
})
