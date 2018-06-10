defmodule CountRegretWeb.GameChannel do
  @moduledoc """
  Lobby and main gameplay channel.
  """
  use Phoenix.Channel

  alias CountRegret.GameMaker
  alias CountRegret.Game

  def join("game:lobby", _message, socket) do
    {:ok, socket}
  end

  def join("game:" <> name, _params, socket) do
    case GameMaker.get_game(name) do
      {:error, _reason} ->
        {:error, %{reason: "That game doesn't exist."}}

      {:ok, game} ->
        player_number = Game.add_player(game)
        {:ok, %{player_number: player_number}, socket}
    end
  end

  def handle_in("new_game", _map, socket) do
    game = GameMaker.make_game()
    name = Game.get_name(game)
    player_number = Game.add_player(game)
    broadcast!(socket, "start_game",
      %{body: "Starting game #{name}! You are player number #{player_number}"})
    assign(socket, :game, game)
    {:noreply, socket}
  end
end
