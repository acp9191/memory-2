defmodule MemoryWeb.PageController do
  use MemoryWeb, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end

  def game(conn, %{"name" => name}) do
    render conn, "game.html", name: name
  end

  # def name(conn, %{"session" => session}) do
  #   name = session["name"]
  #   IO.puts(name)
  #   redirect conn, to: MemoryWeb.Router.Helpers.page_path(conn, :show, name )
  # end

end
