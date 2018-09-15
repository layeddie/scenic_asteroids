defmodule Play.MixProject do
  use Mix.Project

  def project do
    [
      app: :play,
      version: "0.1.0",
      elixir: "~> 1.7",
      start_permanent: Mix.env() == :prod,
      compilers: [:elixir_make] ++ Mix.compilers(),
      make_env: %{"MIX_ENV" => to_string(Mix.env())},
      make_clean: ["clean"],
      deps: deps()
    ]
  end

  # Run "mix help compile.app" to learn about applications.
  def application do
    [
      mod: {Play, []},
      extra_applications: []
    ]
  end

  # Run "mix help deps" to learn about dependencies.
  defp deps do
    [
      {:elixir_make, "~> 0.4"},
      {:dialyxir, "1.0.0-rc.3", only: :dev, runtime: false},
      # {:exsync, "~> 0.2", only: :dev},
      {:exsync, path: "../forks/exsync", only: :dev},

      # deps to use AFTER it is released publicly
      {:scenic, path: "../forks/scenic", override: true},
      {:scenic_driver_glfw, git: "git@github.com:boydm/scenic_driver_glfw.git"},

      # These deps are optional and are included as they are often used.
      # If your app doesn't need them, they are safe to remove.
      {:scenic_sensor, "~> 0.7.0"},
      {:scenic_clock, ">= 0.0.0"}

      # the https versions
      # { :scenic, git: "https://github.com/boydm/scenic.git", override: true },
      # { :scenic_driver_glfw, git: "https://github.com/boydm/scenic_driver_glfw.git"},
      # { :scenic_sensor, git: "https://github.com/boydm/scenic_sensor.git"},
      # { :scenic_clock, git: "https://github.com/boydm/scenic_clock.git"},

      # the ssh versions
      # { :scenic, git: "git@github.com:boydm/scenic.git" },
      # { :scenic_driver_glfw, git: "git@github.com:boydm/scenic_driver_glfw.git"},
      # { :scenic_sensor, git: "git@github.com:boydm/scenic_sensor.git"},
      # { :scenic_clock, git: "git@github.com:boydm/scenic_clock.git"},

      # example deps
      # {:dep_from_hexpm, "~> 0.3.0"},
      # {:dep_from_git, git: "https://github.com/elixir-lang/my_dep.git", tag: "0.1.0"},
    ]
  end
end
