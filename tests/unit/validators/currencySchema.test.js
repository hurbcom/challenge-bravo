import currencySchema from '../../../src/validators/currencySchema.js'

describe('Test validate Currency Schema', () => {
    test('Test validation with success ', async () => {
        const query = {
            code: 'USD',
            name: 'American Dollar',
            inDollar: 1,
            isFiatOrFictitious: false
        }

        const responseValidateSchema = await currencySchema.validate(query)

        await expect(responseValidateSchema).toHaveProperty(['code'])
        await expect(responseValidateSchema).toHaveProperty(['name'])
        await expect(responseValidateSchema).toHaveProperty(['inDollar'])
        await expect(responseValidateSchema).toHaveProperty(['isFiatOrFictitious'])
    })

    test('Test validation with error on format without code field', async () => {
        const body = {
            name: 'American Dollar',
            inDollar: 1,
            isFiatOrFictitious: false
        }

        await expect(currencySchema.validate(body)).rejects.toThrow("The Currency's code is required")
    })
})
