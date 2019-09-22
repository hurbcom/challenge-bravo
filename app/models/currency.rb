class Currency < ApplicationRecord
  validates :name, :code, :symbol, :country, presence: true
  validates :name, length: { maximum: 20 }
  validates :code, length: { is: 3 }
  validates :symbol, length: { maximum: 3 }
  validates :country, length: { maximum: 25 }
  validates :code, uniqueness: true

  scope :ballast, ->() { where(default: true).limit(1) }

  before_validation :validate_default

  private

  def validate_default
    if default_change_to_be_saved == [true, false]
      errors.add(:default, 'you can\'t change default option!!!')
      return
    end

    if default_change_to_be_saved and Currency.ballast.first.present?
      errors.add(:default, 'ballast already setted!!!')
    end
  end
end
