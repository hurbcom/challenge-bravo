class Calculation {
  public Conversion (amount: number, exchangeRate: number): string {
    const total = Math.floor(amount * exchangeRate * 100) / 100
    return total.toFixed(2)
  }
}

export default new Calculation()
