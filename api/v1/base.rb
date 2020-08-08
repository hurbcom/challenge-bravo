module API
  class Base < Roda
    plugin :json
    plugin :all_verbs
    route do |r|
      r.on "api" do
        r.on "v1" do
          r.get 'hello' do
            { hello: :world }
          end
        end
      end
    end
  end
end