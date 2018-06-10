defmodule CountRegretWeb.GameChannel do
  @moduledoc """
  Lobby and main gameplay channel.
  """
  use Phoenix.Channel

  def join("game:lobby", _message, socket) do
    {:ok, socket}
  end

  def join("room:" <> _private_room_id, _params, _socket) do
    {:error, %{reason: "unauthorized"}}
  end
end
