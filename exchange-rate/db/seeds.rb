# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)

currencies = Currency.create([
    { code: "DOT", name: "Polkadot" },
    { code: "BRL", name: "Real Brasileiro" },
])

rates = Rate.create([
    { from_currency_id: 1, to_currency_id: 2, rate: 5.5 },
    { from_currency_id: 2, to_currency_id: 1, rate: 0.18 },
])
