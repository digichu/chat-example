var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

var status = "ok";

var test = new Array();
test.push({var1:1, var2: new Array("ok", {name:ok, test:yes})})

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg + status);
    test1();
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});

function test1(){
  io.emit('something', test);
}
