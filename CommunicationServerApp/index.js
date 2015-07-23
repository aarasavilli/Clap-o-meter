var express = require('express');
var app=express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var interIO = require('socket.io-client');
var webServerSocket = interIO.connect('http://localhost:3000');
var claps = require('./data/claps');

var counter = 0;

webServerSocket.on('connect', function(socket) { 
    console.log('Connected! to Web server');
	
});

io.on('connection', function(socket){
	socket.on('testConnection', function() {
		console.log('Recevied test');
	})

    socket.on('event:new:clap',function(callback){
		counter = counter+1;
		console.log('clap count: '+counter);
		claps.add(counter, new Date(), function(){});
		io.emit('updateClap',counter);
		webServerSocket.emit('updateClap',counter);
		return callback(counter);
    })
	
	socket.on('event:get:countervalue',function(callback) {
		return callback(counter);
	});
});

server.listen(8001,function(){
    console.log('Socket.io Running on port: 8001');
});