defmodule Bravo.Router do
  use Bravo.Web, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", Bravo do
    pipe_through :api
    get "/", ApplicationController, :health
    get "/loaderio-d43fb2ea1570ad6f17c67d5ec6eff738", ApplicationController, :loaderio
    get "/quotations", QuotationController, :index
  end
end
