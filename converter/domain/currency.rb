module Converter
  module Domain
    class Currency

      attr_reader :id, :name, :code, :type

      def self.build_from_model(model_object)
        Currency.new(
          id: model_object.id,
          name: model_object.name,
          code: model_object.code,
          type: model_object.type,
          ballast: model_object.is_ballast?
        )
      end

      def initialize(id:, name:, code:, type:, ballast: false)
        @id = id
        @name = name
        @code = code
        @type = type
        @ballast = ballast
      end

      def is_ballast?
        @ballast
      end

      def to_hash
        {
          id: self.id,
          name: self.name,
          code: self.code,
          type: self.type
        }
      end
    end
  end
end