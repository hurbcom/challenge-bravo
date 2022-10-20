export type TGetCurrencyByParameter = {
  from: string
  to: string
  amount: string
}

export type TCreateCurrency = {
  from: string
  value: number
}

export type TDeleteCurrency = {
  from: string
}
