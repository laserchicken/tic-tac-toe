class Api::V1::GamesController < ApplicationController
  def index
    games = Game.all
    render json: games
  end

  def create
    game = Game.new(game_params)
    if game.save
      ActionCable.server.broadcast 'games', { game: game }
      head :ok
    end
  end

  def show
    game = Game.find(params[:id])
    render json: game, include: [:moves]
  end
  
  private
  
  def game_params
    params.require(:game).permit(:title)
  end
end
