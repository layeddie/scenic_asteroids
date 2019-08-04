defmodule PlayWeb.Router do
  use PlayWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", PlayWeb do
    pipe_through :browser

    get "/", PageController, :index
    post "/signin", PageController, :signin
    post "/logout", PageController, :logout
  end

  # Other scopes may use custom stacks.
  # scope "/api", PlayWeb do
  #   pipe_through :api
  # end
end