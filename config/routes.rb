# frozen_string_literal: true

Rails.application.routes.draw do
  devise_for :users, controllers: { sessions: 'sessions', registrations: 'registrations' }
  # resources :sites
  get 'measurements/:site_id/' => 'measurements#show'
  get 'react/' => 'static_pages#root'
  namespace :api, defaults: { format: :json } do
    get 'sites' => 'sites#api_index'
    post 'series' => 'sites#load_series_data'
    get 'search' => 'sites#search'
    get 'series_csv/:id/' => 'sites#series_csv'
    get 'saved_selections' => 'saved_selections#ajax_get_all'
    post 'save_selections' => 'saved_selections#ajax_create'
  end
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  root 'static_pages#root'
  get 'd3test' => 'static_pages#advanced_d3_test'
  get 'trendline' => 'static_pages#trendline_test'

  get 'data.tsv' => 'static_pages#data'
  get 'usd_euro.csv' => 'static_pages#usd_euro'
end
