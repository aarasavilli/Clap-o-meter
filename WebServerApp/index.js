var express = require('express');
var app=express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
app.use(express.static(__dirname + '/public'));

io.on('connection', function(client){
	console.log('Someone connected');
	client.on('updateClap',function(counter){
	console.log('claps update' + counter);
	io.emit('updateClapinUI',counter);
	});
});

io.on('disconnect', function(){
    console.log('user disconnected');
  });
http.listen(3000, function(){
  console.log('listening on *:3000');
});


