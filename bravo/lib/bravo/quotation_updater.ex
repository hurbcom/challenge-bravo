defmodule Bravo.QuotationUpdater do
  use GenServer
  require Logger

  @moduledoc """
  Esta GenServer tem o objetivo de fazer a atualização do cache das cotações para evitar o acesso sem necessidade da API externa.
  """

  @retry_interval 5 * 1000 # 5 seconds

  def start_link(state \\ %{}), do: GenServer.start_link(__MODULE__, %{}, name: __MODULE__)

  def init(state) do
    Logger.info(fn () -> "Bravo.QuotationUpdater: Start"  end)
    updater()
    {:ok, state}
  end

  def handle_info(:update, state) do
    Logger.info(fn () -> "Bravo.QuotationUpdater: handle_info :update"  end)
    updater() # Reschedule once more
    {:noreply, state}
  end

  defp do_updater() do
    Logger.info(fn () -> "Bravo.QuotationUpdater: do_updater Start"  end)
    case Bravo.QuotationApi.request_quotations do
      {:ok, response} -> update_cache(response.body)
      {:error, type} -> Logger.info(fn () -> "Bravo.QuotationUpdater: Fail #{type}"  end)
    end
    Logger.info(fn () -> "Bravo.QuotationUpdater: Update Cache With Sucess"  end)
  end

  defp update_cache(quotations) do
    Enum.map(quotations, fn({currency, value})->
      Bravo.Cache.set(currency, Decimal.new(value))
    end)
  end

  defp updater() do
    do_updater()
    Process.send_after(self(), :update, @retry_interval)
  end
end