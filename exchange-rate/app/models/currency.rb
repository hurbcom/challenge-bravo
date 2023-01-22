class Currency < ApplicationRecord

    has_many :rates, dependent: :destroy
    validates :name, presence: true, uniqueness: true
    validates :code, presence: true, uniqueness: true
end
