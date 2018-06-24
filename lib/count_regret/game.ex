defmodule CountRegret.Game do
  @moduledoc """
  A named count of players.
  """
  use GenServer
  alias CountRegret.Player

  ## Client API

  def start_link(name, opts \\ []),
    do: GenServer.start_link(__MODULE__, name, opts)

  def get_name(pid), do: GenServer.call(pid, :get_name)

  def get_maze(pid), do: GenServer.call(pid, :get_maze)

  def add_player(pid), do: GenServer.call(pid, :add_player)

  def set_player_position(pid, player_number, x, y),
    do: GenServer.call(pid, {:set_player_position, player_number, x, y})

  def set_maze(pid, maze),
    do: GenServer.cast(pid, {:set_maze, maze})

  def get_players(pid), do: GenServer.call(pid, :get_players)

  def reset_player_positions(pid), do: GenServer.cast(pid, :reset_player_positions)

  ## Server Callbacks

  def init(name) do
    {:ok, %{name: name, maze: nil, players: []}}
  end

  def handle_call(:get_name, _from, %{name: name} = state) do
    {:reply, name, state}
  end

  def handle_call(:get_maze, _from, %{maze: maze} = state) do
    {:reply, maze, state}
  end

  def handle_call(:add_player, _from, %{players: players} = state) do
    num_players = length(players)
    player = %Player{number: num_players, x: 0, y: 0}
    players = List.insert_at(players, num_players, player)
    {:reply, num_players, %{state | players: players}}
  end

  def handle_call({:set_player_position, player_number, x, y}, _from,
      %{players: players} = state) do
        IO.puts "Players: #{inspect players, pretty: true}"
    player = Enum.at(players, player_number)
    player = %{player | x: x, y: y}
    players = List.update_at(players, player_number, fn _ -> player end)
    {:reply, nil, %{state | players: players}}
  end

  def handle_call(:get_players, _from, %{players: players} = state),
    do: {:reply, players, state}

  def handle_cast({:set_maze, maze}, state),
    do: {:noreply, %{state | maze: maze}}

  def handle_cast(:reset_player_positions, %{players: players} = state),
    do: {:noreply, %{state | players: Enum.map(players, &(%{&1 | x: 0, y: 0}))}}



  ## Helper Functions”

end
