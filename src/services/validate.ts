class Validation {
  public Calculate (from: string, to: string, amount: number, memoryCurrency: string): string {
    if ((from.length !== 3 && from.length !== 4) || (to.length !== 3 && to.length !== 4)) return 'Formato de código não suportado, tente enviar um conjunto de 3 a 4 caracteres'
    if (!memoryCurrency.includes(from)) return `Infelizmente ainda não damos suporte para moedas do tipo: ${from}`
    if (!memoryCurrency.includes(to)) return `Infelizmente ainda não damos suporte para moedas do tipo: ${to}`
    if (isNaN(amount)) return 'Valor informado é inválido'
    return ''
  }

  public NewCurrency (currency: string, memoryCurrency: string, list: string): string {
    if (currency.length !== 3 && currency.length !== 4) return 'Formato de código não suportado, tente enviar um conjunto de 3 a 4 caracteres'
    if (!list.includes(currency)) return `Infelizmente ainda não damos suporte para moedas do tipo: ${currency}`
    if (memoryCurrency.includes(currency)) return 'Não é possível adicionar uma moeda que já está registrada na plataforma'
    return ''
  }

  public RemoveCurrency (currency: string, memoryCurrency: string): string {
    if (currency.length !== 3 && currency.length !== 4) return 'Formato de código não suportado, tente enviar um conjunto de 3 a 4 caracteres'
    if (!memoryCurrency.includes(currency)) return 'Não é possível remover uma moeda que não está registrada na plataforma'
    return ''
  }
}

export default new Validation()
