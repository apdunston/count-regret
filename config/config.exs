# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :count_regret,
  ecto_repos: [CountRegret.Repo]

# Configures the endpoint
config :count_regret, CountRegretWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "oKZRsc6kYG2o5n8rKdAX6NqFqFEZTETcqL2z4gpPMgcQnlZeSyBZsxMPOq/P6yLz",
  render_errors: [view: CountRegretWeb.ErrorView, accepts: ~w(html json)],
  pubsub: [name: CountRegret.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:user_id]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
