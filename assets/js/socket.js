import {Socket} from "phoenix"
import $ from "jquery"

let socket = new Socket("/socket", {params: {token: window.userToken}})

socket.connect()

let lobby_channel = socket.channel("game:lobby", {})
let game_channel = null;
let hollow_Cart = new HollowCart();
let player_number = 24601;

let join_game = function() {
  var game_name = $('input[name=game-name]').val();
  console.log("Trying to join game: " + game_name);
  join_game_channel(game_name, resp => { 
    console.log("Joined game successfully", resp) 
    display_game(resp);
    hollow_Cart.startMultiplayerMazeGame(resp.maze, networkDriver, resp.player_number);
    networkDriver.receive(resp);
  });
};

let display_game = function(payload) {
  $('.controls').html("<p>Game Name: " + payload.game_name + "</p>");
}

let join_game_channel = function(game_name, ok_function) {
  game_channel = socket.channel("game:" + game_name, {});
  game_channel.on("key_down", payload => {
    console.log("Received key_down broadcast: ", payload);
  })
  game_channel.on("positions", payload => {
    networkDriver.receive(payload);
  })
  game_channel.join()
    .receive("ok", ok_function)
    .receive("error", resp => { console.log("Unable to join game", resp) })
}

let start_game = function() {
  console.log("Starting game...");
  var maze = hollow_Cart.startMultiplayerMazeGame(maze, networkDriver, 0);
  lobby_channel.push("new_game", maze)
    .receive("ok", resp => { 
      console.log("new_game response", resp);
      display_game(resp);
      join_game_channel(resp.game_name, arg => { 
        console.log("Joined game successfully", arg) 
        networkDriver.receive(arg);
      });
    });  
}

let networkDriver = {
  setMazeGame: function(mazeGame) {
    this.mazeGame = mazeGame;
  },

  send: function(event) {
    // game_channel.push("key_down", {player: player_number, key_code: event.keyCode})
    console.log("sending event: ", event);
    game_channel.push("move", {player_number: event.playerNumber, x: event.x, y: event.y});
    console.log("Count Regret got this: ", event);
  },

  receive: function(event) {
    console.log("Positions: ", event.players);
    this.mazeGame.setPositions(event.players);
  }
}

$(function() {
    $('.start-button').click(function() {
      start_game();
    });

    $('input[name=game-name]').keydown(function(event) {
      if (event.keyCode == 13) {
        start_game();
      }
    });

    $('.join-button').click(function() {
      join_game();
    });
});

lobby_channel.join()
  .receive("ok", resp => { console.log("Joined lobby successfully", resp) })
  .receive("error", resp => { console.log("Unable to join lobby", resp) })

export default socket