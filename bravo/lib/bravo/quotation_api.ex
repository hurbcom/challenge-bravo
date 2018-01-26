defmodule Bravo.QuotationApi do
  use HTTPoison.Base

  def process_url(url) do
    "https://min-api.cryptocompare.com" <> url
  end

  def process_response_body(body) do
    body
    |> Poison.decode!
    |> Enum.map(fn({k, v}) -> {String.to_atom(k), v} end)
  end

  def request_quotations do
    case Bravo.QuotationApi.get("/data/price?fsym=USD&tsyms=BTC,USD,EUR,ETH,BRL") do
      {:ok, response} -> { :ok, response.body }
      error -> error
    end
  end
end