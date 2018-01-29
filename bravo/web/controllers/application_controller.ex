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
    |> text("loaderio-ed5f9ad54a418488ee96b0377f26b944")
    |> halt
  end

  defp now_utc_8601(), do: DateTime.utc_now |> DateTime.to_iso8601
end