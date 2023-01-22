class CreateRates < ActiveRecord::Migration[7.0]
  def change
    create_table :rates do |t|

        t.float :rate, null: false
        t.references :from_currency, null: false, foreign_key: {to_table: :currencies}
        t.references :to_currency, null: false, foreign_key: {to_table: :currencies}

        # This can be used to store the source of the rate, in case is needed in some use case.
        # i.e some existing currency not supported by the current API
        t.string :source

        t.timestamps
    end
  end
end
