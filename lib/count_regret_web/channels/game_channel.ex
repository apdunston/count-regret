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
        {:error, %{reason: "Game #{name} doesn't exist."}}

      {:ok, game} ->
        player_number = Game.add_player(game)
        players = Game.get_players(game)
        maze = Game.get_maze(game)
        socket = assign(socket, :game, game)
        {:ok, %{player_number: player_number, game_name: name, maze: maze, players: players}, socket}
    end
  end

  def handle_in("new_game", %{}, socket) do
    game = GameMaker.make_game()
    name = Game.get_name(game)
    socket = assign(socket, :game, game)
    {:reply, {:ok, %{game_name: name, player_number: 0}}, socket}
  end

  def handle_in("set_maze", maze, socket) do
    Game.set_maze(socket.assigns.game, maze)
    broadcast!(socket, "set_maze", maze)
    {:noreply, socket}
  end

  def handle_in("win", _player_number, socket) do
    Game.reset_player_positions(socket.assigns.game)
    {:noreply, socket}
  end

  def handle_in("move", %{"player_number" => player_number, "x" => x, "y" => y}, socket) do
    game = socket.assigns.game
    Game.set_player_position(game, player_number, x, y)
    broadcast!(socket, "positions", %{players: Game.get_players(game)})
    {:noreply, socket}
  end

  def handle_in(event, payload, socket) do
    IO.puts "UNKNOWN EVENT: #{inspect {event, payload, "socket"}}"
    {:noreply, socket}
  end
end
