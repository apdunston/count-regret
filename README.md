# Count Regret

An online, multiplayer maze game.

## TODO

- [x] Set up a Phoenix channel
  - On a mazegame page
- [x] Start game
  - Gets a game number (:ets.update_counter/3)
- [x] Have JS send start game, then show the number (start game)
- [x] Have a second browser join the game (join game)
- [x] Pass in map when game is created
- [] When I join a game, show me where the first player is.
  - What knows where the player is?
    * A: entity, ergo player
  - What has access to the player?
    * A: mazegame
  - successfulMoveEvent sends to networkDriver which sends "move" up to server.
  - server hears "move", updates the player's position and then broadcasts "positions"
  - networkDriver hears "positions" and calls it on the game which updates everyone except the local.
- [] When someone joins my game, show me where they are
- [] Have JS send the keyboard events
- [] Have Elixir send out the moves (move player)
- [] Have JS rely on the moves elixir sends
- [] Have JS send win game (win game)
- [] Have Elixir send timeout (timeout game)

- [] Make a hex package with https://github.com/first20hours/google-10000-english to generate room names

## Actions

* Start game
* Join game #
* Move player #, game #, direction
* Win game #
* Timeout game


## Development

I'm using the hollow-cart maze game engine. When there's a new edition of hollow-cart, build it and set the bundle.js file in `assets/vendor`. I've named it `hollowCart.js`, but that's not entirely necessary.

* I had to learn to put `hollowCart.js` in the `assets/vendor` directory so B--- wouldn't try to compile it.
* I followed the Phoenix Channel documentation 
* I learned to add jquery to the mix here: http://phoenixframework.org/blog/static-assets
* Registering processes: https://m.alphasights.com/process-registry-in-elixir-a-practical-example-4500ee7c0dcc
* I learned about ETS counters 
  * here https://elixir-lang.org/getting-started/mix-otp/ets.html
  * and here https://jmilet.github.io/ets/counters/elixir/erlang/2016/05/07/ets-counters.html
* `Channel.join/3` can return 
  * `{:error, %{}}`
  * `{:ok, socket}`
  * or `{:okay, %{}, socket}`
* `Channel.handle_in/3` can return
  * `{:noreply, socket}`
  * `{:reply, :ok, socket}`
  * `{:reply, {:ok, %{}}, socket}`
  * `{:stop, :shutdown, {:error, %{}}, socket}`

Elixir to send broadcast
```
    broadcast!(socket, "my_topic",
      %{
        body: "Starting game #{name}! You are player number #{player_number}",
        game_name: name
      })
```

Javascript to receive broadcast
```
lobby_channel.on("my_topic", payload => {
  // Do something with the payload object.
})
```

* `global.myVar = myVar` is how you do global variables in es6