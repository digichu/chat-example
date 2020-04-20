var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

var status = "ok";

var gameState;
var HANDSIZE = 7;
var PLAYTO = 5;
var blackCards;
var whiteCards;


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('reset game', function(msg){

  });
  socket.on('add player', function(player){
    addPlayer(player);
  });
  socket.on('start game', function(gamestate){
    startGame();
  });
  socket.on('play card', function(player, card){
    playCard(player, card);
  });
  socket.on('choose card', function(player, card){
    chooseCard(player, card);
  });

});

http.listen(port, function(){
  console.log('listening on *:' + port);
});

function startGame(){
  gameState = new Object();
  gameState.players = new Array();
  gameState.playedCards = new Array();
  gameState.curPlayer = 0;

  blackCards = new Array();
  whiteCards = new Array();
  populateCards();

  io.emit("game start", gameState)
}

function addPlayer(player){
  var newPlayer = new Object();
  newPlayer.name = player;
  newPlayer.cards = new Array();
  newPlayer.score = 0;

  for(var x = 0; x < HANDSIZE;  x++){
    newPlayer.cards.push(getBlackCard());
  }

  gameState.players.push(newPlayer);
  io.emit("new player added", gameState);
}

function playCard(player, card){
  gameState.playedCards.push({player: player, card: card});
  if(gameState.playedCards.length == gameState.players.length){
    io.emit("all cards played", gameState);
  }
}

function gameStart(){
  io.emit("game start");
}

function chooseCard(player, card){
  for(var x = 0; x < gameState.players.length; x++){
    if(gameState.players[x].name == player){
      gameState.players[x].score++;
    }
    gameState.players[x].cards.push(getWhiteCard());
  }
  io.emit("winning card", player, card, gameState);
}

function getBlackCard(){
  var randomIndex = Math.floor(Math.random() * blackCards.length);
  return blackCards.length > 0 ? blackCards.splice(randomIndex, 1)[0] : null;
}

function getWhiteCard(){
  var randomIndex = Math.floor(Math.random() * whiteCards.length);
  return whiteCards.length > 0 ? whiteCards.splice(randomIndex, 1)[0] : null;
}

function populateCards(){
  ;
}
