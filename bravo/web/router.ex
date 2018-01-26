defmodule Bravo.Router do
  use Bravo.Web, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", Bravo do
    pipe_through :api
    get "/quotations", QuotationController, :index
  end
end
