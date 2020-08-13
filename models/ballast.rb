class Ballast < Sequel::Model
  many_to_one :currency

  def currency
    Currency.find(id: self.currency_id)
  end

end