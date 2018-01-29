defmodule Bravo.QuotationTest do
  use Bravo.ConnCase, async: false

  import Mock

  setup do
    {:ok, cache_pid} = Bravo.Cache.start_link()
    {:ok, %{ cache_pid: cache_pid }}
  end

  test "should calculate correct quotation" do
    with_mock Bravo.QuotationApi, [request_quotations: fn() -> response_success() end] do
      {_, pid} = Bravo.QuotationUpdater.start_link
      assert Bravo.Quotation.get(:BRL, :BTC, 1.0) == {:ok, 2.705e-5}
      assert Bravo.Quotation.get(:USD, :EUR, 0.5) == {:ok, 0.40325}
      assert Bravo.Quotation.get(:UNKNOWN, :EUR, 0.5) == {:error, [unsupported_currency: "currency is not supported"]}
      GenServer.stop(pid)
    end
  end

  def response_success(), do: { :ok, %{ body: [BRL: 3.12, BTC: 8.439e-5, ETH: 8.067e-4, EUR: 0.8065, USD: 1] } }
end
