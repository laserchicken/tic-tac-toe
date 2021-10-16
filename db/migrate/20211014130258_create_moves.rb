class CreateMoves < ActiveRecord::Migration[6.1]
  def change
    create_table :moves do |t|
      t.string :position
      t.string :piece
      t.references :game, null: false, foreign_key: true

      t.timestamps
    end
  end
end
