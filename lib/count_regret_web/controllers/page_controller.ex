defmodule CountRegretWeb.PageController do
  use CountRegretWeb, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
