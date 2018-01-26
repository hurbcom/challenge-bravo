defmodule Bravo.QuotationController do
  use Bravo.Web, :controller

  def index(conn, params) do
    conn
    |> render("index.json", %{ quotations: [%{ result: Bravo.Quotation.get("BRL", "BTC", 10) }] })
  end
end