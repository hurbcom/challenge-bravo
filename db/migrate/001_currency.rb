Sequel.migration do
  change do
    create_table(:currencies) do
      primary_key :id
      String :name, null: false, unique: true
      String :code, null: false, limit: 3, index: {unique: true}, unique: true
      String :type, null: false, default: 'fiat_money'
      DateTime :created_at
      DateTime :updated_at
    end
  end
end