import yup from 'yup'

const currency_validated = yup.object().shape({
    from: yup
        .string()
        .required("FROM is required")
        .uppercase()
        .min(2),

    to: yup
        .string()
        .min(2)
        .required("TO is required")
        .uppercase(),

    rate: yup
        .number()
        .required("rate is required")

})

export default currency_validated;