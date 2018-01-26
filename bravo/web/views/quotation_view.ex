defmodule Bravo.QuotationView do
  use Bravo.Web, :view

  def render("index.json", %{ quotations: quotations }), do: quotations
end