defmodule CountRegret.GameMaker do
  @moduledoc """
  A GenServer that starts and keeps game GenServers.
  """
  use GenServer

  alias CountRegret.Game

  @key {__MODULE__, :counter}

  ## Client API

  def start_link(_opts \\ []), do: GenServer.start_link(__MODULE__, :ok, name: :game_maker)

  def get_count, do: GenServer.call(:game_maker, :get_count)

  def make_game(maze), do: GenServer.call(:game_maker, {:make_game, maze})

  def get_game(name), do: GenServer.call(:game_maker, {:get_game, name})

  ## Server Callbacks

  def init(_args) do
    counter = :ets.new(:counter, [:public])
    state = %{counter: counter, games: %{}}
    {:ok, state}
  end

  def handle_call(:get_count, _from, %{counter: counter} = state) do
    [{@key, number}] = :ets.lookup(counter, @key)
    {:reply, number, state}
  end

  def handle_call({:make_game, maze}, _from, %{counter: counter, games: games} = state) do
    current_count = counter |> increment() |> Integer.to_string
    {:ok, game_pid} = Game.start_link({current_count, maze})
    games = Map.put(games, current_count, game_pid)
    state = %{state | games: games}
    {:reply, game_pid, state}
  end

  def handle_call({:get_game, name}, _from, %{games: games} = state) do
    IO.puts "Trying to get game #{name} from games: #{inspect games} yields #{inspect Map.get(games, name)}"
    game = case Map.get(games, name) do
      nil -> {:error, :no_such_game}
      value -> {:ok, value}
    end

    {:reply, game, state}
  end

  ## Helper Functions”

  defp increment(counter) do
    :ets.update_counter(counter, @key, 1, {@key, 0})
  end
end
