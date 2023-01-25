class Rate < ApplicationRecord
    URL_REGEX = URI::DEFAULT_PARSER.make_regexp(%w[http https])

    belongs_to :currency
    validates :currency, presence: true
    validates :date, presence: true, uniqueness: { scope: :currency_id }
    validates :rate, presence: true, numericality: { greater_than: 0 }
    # Source should be a valid URL
    validates :source, format: { with: URL_REGEX, allow_blank: true }
end
