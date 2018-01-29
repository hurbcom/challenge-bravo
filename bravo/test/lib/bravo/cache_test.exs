defmodule Bravo.CacheTest do
  use Bravo.ConnCase, async: false

  setup do
    {:ok, pid} = Bravo.Cache.start_link()
    {:ok, %{}}
  end

  test "should not has any cache" do
    assert Bravo.Cache.get(:myname) == {:error, :not_found}
  end

  test "should set a new value" do
    Bravo.Cache.set(:name, "Allan")
    assert Bravo.Cache.get(:name) == {:ok, "Allan"}
  end
end
