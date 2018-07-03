(function() {
  'use strict';

  var globals = typeof global === 'undefined' ? self : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = {}.hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (bundle && typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = typeof window === 'undefined' ? this : window;
var process;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
require.register("js/app.js", function(exports, require, module) {
"use strict";

require("phoenix_html");

var _socket = require("./socket");

var _socket2 = _interopRequireDefault(_socket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

});

;require.register("js/networkDriver.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var NetworkDriver = exports.NetworkDriver = {
    origin: "Count Regret Server",

    setGame: function setGame(game) {
        this.game = game;
    },

    setChannel: function setChannel(channel) {
        this.channel = channel;
    },

    sendMaze: function sendMaze() {
        this.channel.push("set_maze", this.game.maze);
    },

    receiveMaze: function receiveMaze(maze) {
        this.game.setMaze(maze);
    },

    sendWin: function sendWin(playerNumber) {
        this.channel.push("win", playerNumber);
    },

    send: function send(event) {
        console.log("networkDriver.send");
        this.channel.push("move", { player_number: event.playerNumber, x: event.x, y: event.y });
    },

    receive: function receive(event) {
        console.log("NetworkDriver Received: ", event);
        console.log("Positions: ", event.players);
        if (this.game) {
            this.game.setPositions(event.players);
        }
    }
};

});

require.register("js/socket.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _phoenix = require("phoenix");

var _networkDriver = require("./networkDriver.js");

var _jquery = require("jquery");

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var socket = new _phoenix.Socket("/socket", { params: { token: window.userToken } });
socket.connect();

var lobby_channel = socket.channel("game:lobby", {});
var game_channel = null;
var hollow_cart = new HollowCart();
var player_number = 24601;

var join_game = function join_game() {
  var game_name = (0, _jquery2.default)('input[name=game-name]').val();
  console.log("Trying to join game: " + game_name);
  join_game_channel(game_name, function (resp) {
    console.log("Joined game successfully", resp);
    display_game(resp);
    hollow_cart.startTrustContent(resp.maze, _networkDriver.NetworkDriver, resp.player_number);
    _networkDriver.NetworkDriver.receive(resp);
  });
};

var display_game = function display_game(payload) {
  (0, _jquery2.default)('.controls').html("<p>Game Name: " + payload.game_name + "</p>");
};

var join_game_channel = function join_game_channel(game_name, ok_function) {
  game_channel = socket.channel("game:" + game_name, {});
  game_channel.on("key_down", function (payload) {
    console.log("Received key_down broadcast: ", payload);
  });
  game_channel.on("positions", function (payload) {
    _networkDriver.NetworkDriver.receive(payload);
  });
  game_channel.on("set_maze", function (payload) {
    _networkDriver.NetworkDriver.receiveMaze(payload);
  });
  game_channel.join().receive("ok", ok_function).receive("error", function (resp) {
    console.log("Unable to join game", resp);
  });

  _networkDriver.NetworkDriver.setChannel(game_channel);
};

var start_game = function start_game() {
  console.log("Starting game...");
  lobby_channel.push("new_game").receive("ok", function (resp) {
    console.log("new_game response", resp);
    display_game(resp);
    join_game_channel(resp.game_name, function (arg) {
      console.log("Started game successfully", arg);
      var maze = hollow_cart.startTrustContent(maze, _networkDriver.NetworkDriver, 0);
      _networkDriver.NetworkDriver.setGame(hollow_cart.getCurrentGame());
      _networkDriver.NetworkDriver.sendMaze(maze);
      _networkDriver.NetworkDriver.receive(arg);
    });
  });
};

(0, _jquery2.default)(function () {
  (0, _jquery2.default)('.start-button').click(function () {
    start_game();
  });

  (0, _jquery2.default)('input[name=game-name]').keydown(function (event) {
    if (event.keyCode == 13) {
      start_game();
    }
  });

  (0, _jquery2.default)('.join-button').click(function () {
    join_game();
  });
});

lobby_channel.join().receive("ok", function (resp) {
  console.log("Joined lobby successfully", resp);
}).receive("error", function (resp) {
  console.log("Unable to join lobby", resp);
});

exports.default = socket;

});

require.alias("process/browser.js", "process");process = require('process');require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');

require('js/app');
//# sourceMappingURL=app.js.map