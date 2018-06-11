// NOTE: The contents of this file will only be executed if
// you uncomment its entry in "assets/js/app.js".

// To use Phoenix channels, the first step is to import Socket
// and connect at the socket path in "lib/web/endpoint.ex":
import {Socket} from "phoenix"
import $ from "jquery"

let socket = new Socket("/socket", {params: {token: window.userToken}})

// When you connect, you'll often need to authenticate the client.
// For example, imagine you have an authentication plug, `MyAuth`,
// which authenticates the session and assigns a `:current_user`.
// If the current user exists you can assign the user's token in
// the connection for use in the layout.
//
// In your "lib/web/router.ex":
//
//     pipeline :browser do
//       ...
//       plug MyAuth
//       plug :put_user_token
//     end
//
//     defp put_user_token(conn, _) do
//       if current_user = conn.assigns[:current_user] do
//         token = Phoenix.Token.sign(conn, "user socket", current_user.id)
//         assign(conn, :user_token, token)
//       else
//         conn
//       end
//     end
//
// Now you need to pass this token to JavaScript. You can do so
// inside a script tag in "lib/web/templates/layout/app.html.eex":
//
//     <script>window.userToken = "<%= assigns[:user_token] %>";</script>
//
// You will need to verify the user token in the "connect/2" function
// in "lib/web/channels/user_socket.ex":
//
//     def connect(%{"token" => token}, socket) do
//       # max_age: 1209600 is equivalent to two weeks in seconds
//       case Phoenix.Token.verify(socket, "user socket", token, max_age: 1209600) do
//         {:ok, user_id} ->
//           {:ok, assign(socket, :user, user_id)}
//         {:error, reason} ->
//           :error
//       end
//     end
//
// Finally, pass the token on connect as below. Or remove it
// from connect if you don't care about authentication.

socket.connect()

let lobby_channel = socket.channel("game:lobby", {})
let game_channel = null;

let join_game = function() {
  var game_name = $('input[name=game-name]').val();
  console.log("Trying to join game: " + game_name);
  game_channel = socket.channel("game:" + game_name, {});
  game_channel.join()
    .receive("ok", resp => { 
      console.log("Joined game successfully", resp) 
      display_game(resp);

      console.log("maze: ",resp.maze);
      startGame(resp.maze);
    })
    .receive("error", resp => { console.log("Unable to join game", resp) })
};

let display_game = function(payload) {
  $('.controls').html("<p>Game Name: " + payload.game_name + "</p>");
}

$(function() {
    $('.start-button').click(function() {
      var maze = startGame();
      lobby_channel.push("new_game", maze)
        .receive("ok", resp => { display_game(resp) });
    });

    $('.join-button').click(function() {
      join_game();
    });
});


lobby_channel.join()
  .receive("ok", resp => { console.log("Joined lobby successfully", resp) })
  .receive("error", resp => { console.log("Unable to join lobby", resp) })

export default socket