defmodule Bravo.Router do
  use Bravo.Web, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", Bravo do
    pipe_through :api
    get "/", ApplicationController, :health
    get "/loaderio-ed5f9ad54a418488ee96b0377f26b944", ApplicationController, :loaderio
    get "/quotations", QuotationController, :index
  end
end
