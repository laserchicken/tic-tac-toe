Rails.application.routes.draw do
  root 'homepage#index'
  get 'games(/:id)', to: 'homepage#index'
  mount ActionCable.server => '/cable'
  namespace :api do
    namespace :v1 do
      resources :games, only: [:index, :create, :show]
      resources :moves, only: [:create]
    end
  end
end
