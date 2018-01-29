defmodule Bravo.Cache do
  use GenServer

  @moduledoc """
  Esta GenServer tem o objetivo de criar um cache "in-memory" evitando utilizar serviços estermos sem necessidade.
  """

  # Public Interface

  def get(key), do: GenServer.call(__MODULE__, {:get, key})
  def set(key, value), do: GenServer.cast(__MODULE__, {:set, {key, value}})

  # Private Interface

  def start_link(state \\ %{}), do: GenServer.start_link(__MODULE__, %{}, name: __MODULE__)
  def init(state), do: {:ok, state}

  def handle_call({:get, key}, _pid, state) do
    result = case Map.get(state, key) do
      nil -> {:error, :not_found}
      value -> {:ok, value}
    end

    {:reply, result, state}
  end

  def handle_cast({:set, {key, value}}, state), do: {:noreply, Map.put(state, key, value)}
end
