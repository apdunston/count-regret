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
        maze = Game.get_maze(game)
        {:ok, %{player_number: player_number, game_name: name, maze: maze}, socket}
    end
  end

  def handle_in("new_game", maze, socket) do
    game = GameMaker.make_game(maze)
    name = Game.get_name(game)
    player_number = Game.add_player(game)
    assign(socket, :game, game)
    {:reply, {:ok, %{game_name: name, player_number: player_number}}, socket}
  end

  def handle_in("key_down", %{"player" => player, "key_code" => key_code}, socket) do
    broadcast!(socket, "key_down",
      %{
        player: player,
        key_code: key_code
      })
    {:noreply, socket}
  end

  def handle_in(event, payload, socket) do
    IO.puts "UNKNOWN EVENT: #{inspect {event, payload, "socket"}}"
    {:noreply, socket}
  end
end
