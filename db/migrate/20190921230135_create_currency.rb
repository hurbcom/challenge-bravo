class CreateCurrency < ActiveRecord::Migration[5.2]
  def change
    create_table :currencies do |t|
      t.string :name, limit: 20, null: false
      t.string :code, limit: 3 ,index: {unique: true}, null: false
      t.string :symbol, limit: 3, null: false
      t.string :country, limit: 25, null: false
      t.boolean :default, default: false, null: false

      t.timestamps
    end
  end
end
