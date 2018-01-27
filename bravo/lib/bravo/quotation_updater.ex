defmodule Bravo.QuotationUpdater do
  use GenServer
  require Logger

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
      {:ok, quotations} ->
        update_cache(quotations)
      {:error, type} -> Logger.info(fn () -> "Bravo.QuotationUpdater: Fail #{type}"  end)
    end
    Logger.info(fn () -> "Bravo.QuotationUpdater: Update Cache With Sucess"  end)
  end

  defp update_cache(quotations) do
    Enum.map(quotations, fn({currency, value})->
      Bravo.Cache.set(currency, value)
    end)
  end

  defp updater() do
    do_updater()
    Process.send_after(self(), :update, 60 * 1000) # 1 minute
  end
end