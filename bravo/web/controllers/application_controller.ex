defmodule Bravo.ApplicationController do
  use Bravo.Web, :controller

  def health(conn, _params) do
    conn
    |> put_status(200)
    |> render("health.json", %{ health: %{ status: :ok, datetime: now_utc_8601() } })
    |> halt
  end

  def loaderio(conn, _params) do
    conn
    |> put_status(200)
    |> text("loaderio-d43fb2ea1570ad6f17c67d5ec6eff738")
    |> halt
  end

  defp now_utc_8601(), do: DateTime.utc_now |> DateTime.to_iso8601
end