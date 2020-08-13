class Currency < Sequel::Model

  CRYPTOCURRENCY =  "cryptocurrency"
  FIAT_MONEY = "fiat_money"

  plugin :timestamps
  plugin :json_serializer
  plugin :validation_class_methods
  one_to_one :ballast
  validates_inclusion_of :type, in: [CRYPTOCURRENCY, FIAT_MONEY]

  def is_ballast?
    self.ballast ? true : false
  end
end