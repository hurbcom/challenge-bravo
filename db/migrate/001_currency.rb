Sequel.migration do
  change do
    create_table(:currencies) do
      primary_key :id
      String :name, null: false
      String :code, null: false, limit: 3, index: {unique: true}
      String :type, null: false, default: 'fiat money'
      Boolean :ballast, default: false, null: false
      DateTime :created_at
      DateTime :updated_at
    end
  end
end