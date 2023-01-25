class Currency < ApplicationRecord

    has_many :rates, dependent: :destroy
    validates :name, presence: true, uniqueness: true
    validates :code, presence: true, uniqueness: true


    protected

    def create_rate(from:, to:, rate:, source:)
        # Create rate and inverse rate
         self.rates.create(
            { from: from, to: to, rate: rate, source: source },
            { from: to, to: from, rate: 1/rate, source: source }
            )
    end
end
