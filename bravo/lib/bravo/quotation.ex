defmodule Bravo.Quotation do
  @currencies [:USD, :BRL, :EUR, :BTC, :ETH]

  def get(from, to, value), do: do_get(normalize(from), normalize(to), value)

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
          {:ok, to_value} -> {:ok, do_calculate(from_value, to_value, value)}
          {:error, type} -> {:error, {:currency_not_cached, "to #{to} not cached"}}
        end
      {:error, type} -> {:error, {:currency_not_cached, "from #{from} not cached"}}
    end
  end

  defp do_calculate(from_value, to_value, value), do: ( from_value / to_value ) * value

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
end