defmodule Bravo.QuotationController do
  use Bravo.Web, :controller

  def index(conn, params) do
    conn
    |> render("index.json", %{quotations: calculate_many(params["from"], params["to"], params["amount"]) })
    |> halt
  end

  defp calculate_many(from, tos, amount) when is_binary(tos), do: calculate_many(from, String.split(tos, ","), amount)
  defp calculate_many(from, tos, amount) do
    Enum.map(tos, fn(to)->
      case Bravo.Quotation.get(from, to, amount) do
        {:ok, result} -> result
        {:error, {type, message}} -> %{ error_type: type, message: message }
      end
    end)
  end
end