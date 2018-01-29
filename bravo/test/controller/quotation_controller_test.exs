defmodule Bravo.QuotationControllerTest do
  use Bravo.ConnCase, async: false

  import Mock

  setup do
    {:ok, cache_pid} = Bravo.Cache.start_link()
    {:ok, %{ cache_pid: cache_pid }}
  end

  test "should validate params", %{conn: conn} do
    with_mock Bravo.QuotationApi, [request_quotations: fn() -> response_success() end] do
      {_, pid} = Bravo.QuotationUpdater.start_link

      response = conn
      |> get(quotation_path(conn, :index))
      |> json_response(422)

      assert response == %{"errors" => ["param \"from\" is required","param \"to\" is required","param \"amount\" is required"]}

      GenServer.stop(pid)
    end
  end

  test "should calculate with success", %{conn: conn} do
    with_mock Bravo.QuotationApi, [request_quotations: fn() -> response_success() end] do
      {_, pid} = Bravo.QuotationUpdater.start_link

      response = conn
      |> get(quotation_path(conn, :index), %{"from" => "BRL", "to" => "USD", "amount" => 2})
      |> json_response(200)

      assert response == %{"USD" => 0.64102564}

      GenServer.stop(pid)
    end
  end

  test "should calculate many with success and error", %{conn: conn} do
    with_mock Bravo.QuotationApi, [request_quotations: fn() -> response_success() end] do
      {_, pid} = Bravo.QuotationUpdater.start_link

      response = conn
      |> get(quotation_path(conn, :index), %{"from" => "BRL", "to" => "USD,ETH,NOT_FOUND", "amount" => 2})
      |> json_response(200)

      assert response == %{"USD" => 0.64102564, "ETH" => 5.1712e-4, "NOT_FOUND" => "currency is not supported"}

      GenServer.stop(pid)
    end
  end

  def response_success(), do: { :ok, %{ body: [BRL: 3.12, BTC: 8.439e-5, ETH: 8.067e-4, EUR: 0.8065, USD: 1] } }
end
