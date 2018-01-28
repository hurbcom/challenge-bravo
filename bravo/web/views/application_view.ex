defmodule Bravo.ApplicationView do
  use Bravo.Web, :view

  def render("health.json", %{ health: health }), do: health
end