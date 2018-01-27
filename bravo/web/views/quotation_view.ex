defmodule Bravo.QuotationView do
  use Bravo.Web, :view

  def render("index.json", %{ quotations: quotations }), do: quotations
  def render("errors.json", %{errors: errors}), do: %{errors: errors}
end