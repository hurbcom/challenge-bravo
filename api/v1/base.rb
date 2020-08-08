module API
  module V1
    class Base < Roda
      plugin :json
      plugin :all_verbs
      route do |r|
        r.on "api" do
          r.on "v1" do
            r.get 'currencies' do
              @currency = Currency.all
            end
          end
        end
      end
    end
  end
end