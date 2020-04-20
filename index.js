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

function setup(){
  gameState = new Object();
  gameState.players = new Array();
  gameState.playedCards = new Array();
  gameState.curPlayer = 0;

  blackCards = new Array();
  whiteCards = new Array();
  populateCards();
}

function startGame(){
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
  blackCards.push("Class, pay closeattention. I will now demonstrate the physics of __________.");
  blackCards.push("Coming to theaters this holiday season, “Star Wars: The Rise of ___________.”");
  blackCards.push("Never fear, Captain ___________ is here!");
  blackCards.push("I don’t really know what my mom’s job is, but I think it has something to do with __________.");
  blackCards.push("What’s about to take this school dance to the next level?");
  blackCards.push("Shut up, Becky! At least I’m not __________.");
  blackCards.push("Oh, no thank you, Mrs. Lee. I’ve had plenty of __________ for now.");
  blackCards.push("MY NAME CHUNGO. CHUNGO LOVE ___________.");

  whiteCards.push("Being dead. ");
  whiteCards.push("Filling my butt with spaghetti.");
  whiteCards.push("Idiots.");
  whiteCards.push("The garbage man.");
  whiteCards.push("Getting married.");
  whiteCards.push("Peer pressure.");
  whiteCards.push("Slowly turning into cheese.");
  whiteCards.push("Eating a whole roll of toilet paper.");
  whiteCards.push("Using my butt as a microwave");
  whiteCards.push("Crab-walking from the toilet to get more toilet paper.");
  whiteCards.push("Diarrhea.");
  whiteCards.push("Coffee.");
  whiteCards.push("Saving up my boogers for ten years and then building the world’s largest booger");
  whiteCards.push("Mashing a banana into your belly button.");
  whiteCards.push("Falling in love.");
  whiteCards.push("Drinking gasoline to see what it tastes like");
  whiteCards.push("My father, who is a walrus.");
  whiteCards.push("Not wearing pants.");



}
