class Rate < ApplicationRecord
    URL_REGEX = URI::DEFAULT_PARSER.make_regexp(%w[http https])

    belongs_to :from_currency, class_name: 'Currency'
    belongs_to :to_currency, class_name: 'Currency'

    validates :date, presence: true, uniqueness: { scope: :from_currency_id }
    validates :rate, presence: true, numericality: { greater_than: 0 }
    # Source should be a valid URL
    validates :source, format: { with: URL_REGEX, allow_blank: true }
end
