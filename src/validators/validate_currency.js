import yup from 'yup'

const currency_validated = yup.object().shape({
    name: yup
        .string()
        .required("Name is required"),

    code: yup
        .string()
        .min(3)
        .required("Code is required")
        .uppercase(),

    rate: yup
        .number()
        .required("Rate is required")
        .positive(),

    fiatOrFic: yup
        .bool()
        .required("Field 'Fiat or Fic' is required")
})

export default currency_validated;