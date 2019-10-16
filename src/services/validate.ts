class Validation {
  public NewCurrency (currency: string, memoryCurrency: string, list: string): string {
    if (currency.length !== 3) return 'Formato de código não suportado, tente enviar um conjunto de 3 caracteres'
    if (!list.includes(currency)) return `Infelizmente ainda não damos suporte para moedas do tipo: ${currency}`
    if (memoryCurrency.includes(currency)) return 'Não é possível adicionar uma moeda que já está registrada na plataforma'
    return ''
  }

  public RemoveCurrency (currency: string, memoryCurrency: string): string {
    if (currency.length !== 3) return 'Formato de código não suportado, tente enviar um conjunto de 3 caracteres'
    if (!memoryCurrency.includes(currency)) return 'Não é possível remover uma moeda que não está registrada na plataforma'
    return ''
  }
}

export default new Validation()
