class Currency < Sequel::Model
  plugin :timestamps
  plugin :json_serializer
end