defmodule Bravo.Quotation do
  @currencies [:USD, :BRL, :EUR, :BTC, :ETH]

  def get(from, to, value), do: do_get(normalize(from), normalize(to), normalize_number(value))

  defp do_get(from, to, value) when is_number(value) do
    case validates([{:from, from}, {:to, to}], []) do
      [] -> calculate(from, to, value)
      errors -> {:error, errors}
    end
  end

  defp calculate(from, to, value) do
    case Bravo.Cache.get(from) do
      {:ok, from_value} ->
        case Bravo.Cache.get(to) do
          {:ok, to_value} -> {:ok, do_calculate({ from, from_value }, {to, to_value}, value)}
          {:error, type} -> {:error, {:currency_not_cached, "to #{to} not cached"}}
        end
      {:error, type} -> {:error, {:currency_not_cached, "from #{from} not cached"}}
    end
  end

  defp do_calculate({from, from_value}, {to, to_value}, value) do
    %{}
    |> Map.put(:total, ( to_value / from_value ) * value)
    |> Map.put(from, from_value)
    |> Map.put(to, to_value)
  end

  defp validates([], errors), do: errors
  defp validates([ {key, value} | last ], errors) do
    if Enum.member?(@currencies, normalize(value)) do
      validates(last, errors)
    else
      validates(last, errors ++ [{:error, {:unsupported_currency, "#{key} #{value} is not supported"}}])
    end
  end

  defp normalize(currency) when is_binary(currency) do
    currency
    |> String.upcase
    |> String.to_atom
  end
  defp normalize(currency), do: currency

  def normalize_number(number) when is_binary(number) do
    case Float.parse(number) do
      :error -> 1.0
      { value, _ } -> value
    end
  end
  def normalize_number(number), do: number
end