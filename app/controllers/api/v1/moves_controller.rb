class Api::V1::MovesController < ApplicationController
  def create
    move = Move.new(move_params)
    game = Game.find(move_params[:game_id])

    if move.save
      MovesChannel.broadcast_to game, { move: move }
      head :ok
    end
  end
  
  private
  
  def move_params
    params.require(:move).permit(:position, :piece, :game_id)
  end
end
