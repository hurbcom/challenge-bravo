import * as yup from 'yup'

const conversionSchema = yup.object().shape({
    from: yup
        .string()
        .required("The 'from' field is required")
        .min(2)
        .uppercase(),

    to: yup
        .string()
        .required("The 'to' field is required")
        .min(2)
        .uppercase(),

    amount: yup
        .string()
        .required("The 'amount' field is required")
})

export default conversionSchema
