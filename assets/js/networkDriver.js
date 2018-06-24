export var NetworkDriver = {
    origin: "Count Regret Server",

    setGame: function(game) {
      this.game = game;
    },

    setChannel: function(channel) {
        this.channel = channel;
    },

    sendMaze: function() {
        this.channel.push("set_maze", this.game.maze);
    },

    receiveMaze: function(maze) {
        this.game.setMaze(maze);
    },

    sendWin: function(playerNumber) {
        this.channel.push("win", playerNumber);
    },

    send: function(event) {
      console.log("networkDriver.send");
      this.channel.push("move", {player_number: event.playerNumber, x: event.x, y: event.y});
    },
  
    receive: function(event) {
      console.log("NetworkDriver Received: ", event);
      console.log("Positions: ", event.players);
      if (this.game) {
          this.game.setPositions(event.players);
      }
    }
};