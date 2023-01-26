class CreateRates < ActiveRecord::Migration[7.0]
  def change
    create_table :rates do |t|

        # More precision, store as cents
        t.decimal :rate, null: false, precision: 10, scale: 6
        t.references :from_currency, null: false, foreign_key: {to_table: :currencies}
        t.references :to_currency, null: false, foreign_key: {to_table: :currencies}

        # Allow for historical times - could also be done using the updated at.
        t.datetime :date, null: false, default: -> { Time.now.to_date }

        # This can be used to store the source of the rate, in case is needed in some use case.
        # i.e some existing currency not supported by the current API
        t.string :source

        t.timestamps
    end
  end
end
