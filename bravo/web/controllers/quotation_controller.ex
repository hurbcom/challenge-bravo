defmodule Bravo.QuotationController do
  use Bravo.Web, :controller

  def index(conn, params) do
    case validate_params(params) do
      [] ->
        conn
        |> render("index.json", %{quotations: calculate_many(params["from"], params["to"], params["amount"], %{}) })
        |> halt
      errors ->
        conn
        |> put_status(422)
        |> render("errors.json", %{errors: errors})
        |> halt
    end
  end

  defp calculate_many(from, tos, amount, list) when is_binary(tos), do: calculate_many(from, String.split(tos, ","), amount, list)
  defp calculate_many(_from, [], _amount, list), do: list
  defp calculate_many(from, [top | bottom], amount, list) do
    list = case Bravo.Quotation.get(from, top, amount) do
      {:ok, result} -> Map.put(list, top, result)
      {:error, errors} -> Map.put(list, top, build_message(errors))
    end
    calculate_many(from, bottom, amount, list)
  end

  defp build_message(errors) do
    Enum.reduce(errors, [], fn ({ type, message }, acc)->
      acc ++ [message]
    end)
    |> Enum.join("; ")
  end

  defp validate_params(params) do
    Enum.reduce(["from", "to", "amount"], [], fn(param, acc)->
      case Map.get(params, param) do
        nil -> acc ++ ["param \"#{param}\" is required"]
        _   -> acc
      end
    end)
  end
end