Sequel.migration do
  change do
    create_table(:ballasts) do
      foreign_key :currency_id, :currencies, unique: true
      Boolean :lock, default: true, unique: true
    end
  end
end