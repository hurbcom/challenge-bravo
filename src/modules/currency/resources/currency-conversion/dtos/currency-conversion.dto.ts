export interface CurrencyConversionRequestDTO {
  from: string,
  to: string,
  amount: string
}

export interface CurrencyConversionResponseDTO {
  value: string
}