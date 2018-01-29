defmodule Bravo.QuotationUpdaterTest do
  use Bravo.ConnCase, async: false

  import Mock

  setup do
    {:ok, cache_pid} = Bravo.Cache.start_link()
    {:ok, %{ cache_pid: cache_pid }}
  end

  test "should create a correnct cache" do
    with_mock Bravo.QuotationApi, [request_quotations: fn() -> response_success() end] do
      {_, pid} = Bravo.QuotationUpdater.start_link
      assert Bravo.Cache.get(:BRL) == {:ok, Decimal.new(3.12)}
      assert Bravo.Cache.get(:BTC) == {:ok, Decimal.new(8.439e-5)}
      assert Bravo.Cache.get(:ETH) == {:ok, Decimal.new(8.067e-4)}
      assert Bravo.Cache.get(:EUR) == {:ok, Decimal.new(0.8065)}
      assert Bravo.Cache.get(:USD) == {:ok, Decimal.new(1)}
      GenServer.stop(pid)
    end
  end

  test "should not create a cache" do
    with_mock Bravo.QuotationApi, [request_quotations: fn() -> response_error() end] do
      {_, pid} = Bravo.QuotationUpdater.start_link
      assert Bravo.Cache.get(:BRL) == {:error, :not_found}
      assert Bravo.Cache.get(:BTC) == {:error, :not_found}
      assert Bravo.Cache.get(:ETH) == {:error, :not_found}
      assert Bravo.Cache.get(:EUR) == {:error, :not_found}
      assert Bravo.Cache.get(:USD) == {:error, :not_found}
      GenServer.stop(pid)
    end
  end

  def response_success(), do: { :ok, %{ body: [BRL: 3.12, BTC: 8.439e-5, ETH: 8.067e-4, EUR: 0.8065, USD: 1] } }
  def response_error(), do: { :error, %{} }
end
