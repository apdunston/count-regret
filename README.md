# Count Regret

An online, multiplayer maze game.

## TODO

- [x] Set up a Phoenix channel
  - On a mazegame page
- [] Start game
  - Gets a game number (:ets.update_counter/3)
- [] Have JS send start game, then show the number (start game)
- [] Have JS send the keyboard events
- [] Have a second browser join the game (join game)
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