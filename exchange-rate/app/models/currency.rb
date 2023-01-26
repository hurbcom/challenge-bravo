class Currency < ApplicationRecord

    has_many :rates, foreign_key:  "from_currency_id", dependent: :destroy
    has_many :inverse_rates, class_name: 'Rate', foreign_key:  "to_currency_id", dependent: :destroy

    validates :name, presence: true, uniqueness: true
    validates :code, presence: true, uniqueness: true, length: 3..5

    # All codes must be saved uppercase
    before_save { code.upcase! if code.present? }

    def create_rate(to_id:, rate:, source: nil)
        # Create rate
        rates.create( { to_currency_id: to_id, rate: rate, source: source, date: Time.now } )

        # Create inverse rate
        inverse_rates.create( { from_currency_id: to_id, rate: 1/rate, source: source, date: Time.now } )
    end

end
