defmodule MemoryWeb.GamesChannel do
  use MemoryWeb, :channel

  alias Memory.Game
  alias Hangman.BackupAgent

  def join("games:" <> name, payload, socket) do
    if authorized?(payload) do
      game = BackupAgent.get(name) || Game.new()
      socket = socket
      |> assign(:game, game)
      |> assign(:name, name)
      BackupAgent.put(name, game)
      {:ok, %{"join" => name, "game" => Game.client_view(game)}, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

   def handle_in("match", %{"tileNo" => tileNo}, socket) do
    name = socket.assigns[:name]
    game = Game.match(socket.assigns[:game], tileNo)
    socket = assign(socket, :game, game)
    BackupAgent.put(name, game)
    {:reply, {:ok, %{ "game" => Game.client_view(game)}}, socket}
  end

  def handle_in("timeout", nil, socket) do
    name = socket.assigns[:name]
    game = Game.timeout(socket.assigns[:game]);
    socket = assign(socket, :game, game)
    BackupAgent.put(name, game)
    {:reply, {:ok, %{ "game" => Game.client_view(game)}}, socket}
  end

  def handle_in("restart", nil, socket) do
    name = socket.assigns[:name]
    # game = socket.assigns[:game]
    BackupAgent.delete(name)
    {:reply, {:ok, %{ "game" => Game.new()}}, socket}
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  def handle_in("ping", payload, socket) do
    {:reply, {:ok, payload}, socket}
  end

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (games:lobby).
  def handle_in("shout", payload, socket) do
    broadcast socket, "shout", payload
    {:noreply, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
