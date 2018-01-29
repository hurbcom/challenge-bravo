defmodule Bravo.Quotation do
  @currencies [:USD, :BRL, :EUR, :BTC, :ETH]

  @moduledoc """
  Este módulo é responsável por fazer o calculo da cotação.
  """

  @doc """
  Públic Interface

  ## Example

  iex> Bravo.Quotation.get(:BTC, :EUR, 100.0)
  123
  """
  def get(from, to, value), do: do_get(normalize(from), normalize(to), normalize_number(value))

  defp do_get(from, to, value) when is_number(value) do
    case validates([from, to], []) do
      [] -> calculate(from, to, value)
      errors -> {:error, errors}
    end
  end

  defp calculate(from, to, value) do
    case Bravo.Cache.get(from) do
      {:ok, from_value} ->
        case Bravo.Cache.get(to) do
          {:ok, to_value} -> {:ok, do_calculate(from_value, to_value, value)}
          {:error, type} -> {:error, {:currency_not_cached, "currency #{to} not cached"}}
        end
      {:error, type} -> {:error, {:currency_not_cached, "currency #{from} not cached"}}
    end
  end

  defp do_calculate(from_value, to_value, value) do
    Decimal.div(to_value, from_value)
    |> Decimal.mult( Decimal.new(value) )
    |> Decimal.to_float
    |> Float.round(8)
  end

  defp validates([], errors), do: errors
  defp validates([ value | last ], errors) do
    if Enum.member?(@currencies, normalize(value)) do
      validates(last, errors)
    else
      validates(last, errors ++ [{:unsupported_currency, "currency is not supported"}])
    end
  end

  defp normalize(currency) when is_binary(currency) do
    currency
    |> String.upcase
    |> String.to_atom
  end
  defp normalize(currency), do: currency

  defp normalize_number(number) when is_binary(number) do
    case Float.parse(number) do
      :error -> 1.0
      { value, _ } -> value
    end
  end
  defp normalize_number(number), do: number
end