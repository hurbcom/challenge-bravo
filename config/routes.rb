Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  resources :currency, only: [:create, :destroy, :index], defaults: { format: :json } do
    collection do
      get :convert
    end
  end
end
