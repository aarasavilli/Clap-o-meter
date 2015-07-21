var express = require('express');
var app=express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var interIO = require('socket.io');
//var webServerSocket = interIO.connect('http://localhost:3000');
var counter = 0;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket){
	socket.on('testConnection', function() {
		console.log('Recevied test');
	})

    socket.on('event:new:clap',function(callback){
		counter = counter+1;
		console.log('clap count: '+counter);
		io.emit('updateClap',counter);
		//webServerSocket.emit('updateClap',counter);
		return callback(counter);
    });
});

server.listen(8001,function(){
    console.log('Socket.io Running on port: 8001');
});