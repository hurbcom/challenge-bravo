const currency = require('./currency')

test('Adiciona/atualiza moeda', () => {
  currency.add("USD", 3)
  expect(currency.get("USD")).toBe(3);

  currency.add("USD", 2)
  expect(currency.get("USD")).toBe(2);
})

test('Converte duas moedas diretamente', () => {
  currency.add("EUR", .8)
  currency.add("BRL", 4)
  expect(currency.convert("EUR", "BRL", 50)).toBe(250);
})
