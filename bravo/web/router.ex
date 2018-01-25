defmodule Bravo.Router do
  use Bravo.Web, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/api", Bravo do
    pipe_through :api
  end
end
