defmodule Memory.Game do
  def new do
    %{
      tiles: shuffle_tiles(),
      selectedTile: nil,
      showTiles: [],
      matchedTiles: [],
      timeout: false,
      clicks: 0
    }
  end

  def client_view(game) do
    %{
      score: game.clicks,
      matchesLeft: (length(shuffle_tiles()) / 2) - (length(game.matchedTiles) / 4),
      canClick: true,
      showTiles: game.showTiles,
      matchedTiles: game.matchedTiles,
      timeout: game.timeout
    }
  end

  def match(game, tileNo) do
    newGame = Map.put(game, :clicks, game.clicks + 1)
    {x, _ } = Integer.parse(tileNo)
    if !game.selectedTile do
      newGame
      |> Map.put(:selectedTile, x)
      |> Map.put(:showTiles, game.showTiles ++ [x] ++ [Enum.at(game.tiles, x)])
    else
      if (Enum.at(game.tiles, x) == Enum.at(game.tiles, game.selectedTile)) do
        newGame
        |> Map.put(:matchedTiles, game.matchedTiles ++ [x] ++ [Enum.at(game.tiles, x)] ++ [game.selectedTile] ++ [Enum.at(game.tiles, game.selectedTile)])
        |> Map.put(:selectedTile, nil)
        |> Map.put(:showTiles, [])
      else
        # no match 
        newGame
        |> Map.put(:timeout, true)
        |> Map.put(:showTiles, game.showTiles ++ [x] ++ [Enum.at(game.tiles, x)])
      end
    end
  end

  def timeout(game) do
    game
    |> Map.put(:showTiles, [])
    |> Map.put(:timeout, false)
    |> Map.put(:selectedTile, nil)
  end

  def shuffle_tiles do
    Enum.shuffle(["A", "A", "B", "B", "C", "C", "D", "D", "E", "E", "F", "F", "G", "G", "H", "H"])
  end
end
