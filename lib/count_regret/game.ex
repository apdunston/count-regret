defmodule CountRegret.Game do
  @moduledoc """
  A named count of players.
  """
  use GenServer

  ## Client API

  def start_link(name, opts \\ []) do
    GenServer.start_link(__MODULE__, {:ok, name}, opts)
  end

  def get_name(pid) do
    GenServer.call(pid, :get_name)
  end

  def add_player(pid) do
    GenServer.call(pid, :add_player)
  end

  ## Server Callbacks

  def init({:ok, name}) do
    {:ok, %{name: name, players: 0}}
  end

  def handle_call(:get_name, _from, %{name: name} = state) do
    {:reply, name, state}
  end

  def handle_call(:add_player, _from, %{players: players} = state) do
    players = players + 1
    {:reply, players, %{state | players: players}}
  end

  ## Helper Functions”

end
