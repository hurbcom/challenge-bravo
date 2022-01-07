import * as yup from 'yup'

const currencySchema = yup.object().shape({
    code: yup
        .string()
        .required("The Currency's code is required")
        .min(2)
        .uppercase(),

    name: yup
        .string()
        .required("The Currency's name is required"),

    inDollar: yup
        .number()
        .required("The 'inDollar' field is required")
        .positive(),

    isFiatOrFictitious: yup
        .bool()
        .required("The 'isFiatOrFictitious' field is required")
})

export default currencySchema
