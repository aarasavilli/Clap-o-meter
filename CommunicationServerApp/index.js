var express = require('express');
var app=express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var interIO = require('socket.io-client');
var webServerSocket = interIO.connect('http://localhost:3000');
var claps = require('./data/claps');

var counter = 0;
var questionArray= 
					[
					{ "question": "question 1" },
					{ "question": "question 2" },
					{ "question": "question 3" },
					{ "question": "question 4" },
					{ "question": "question 5" }
					];
webServerSocket.on('connect', function(socket) { 
    console.log('Connected! to Web server');
	
});

var countdown = 1000;  

setInterval(function() {  
  countdown--;
  if(counter > 0)counter--;
  io.sockets.emit('timer', { countdown: countdown });
  io.emit('updateClap',counter);
  webServerSocket.emit('updateClap',counter);
}, 1000);

io.on('connection', function(socket){
	
	var questionCounter = setInterval(function () {myTimer()}, 10000);
	var queNumber = 0;
	function myTimer() {
	if(queNumber < questionArray.length){
		console.log('question : '+ questionArray[queNumber].question);
		socket.emit('showQuestion', questionArray[queNumber].question);
		queNumber = queNumber +1;
	}
	else{
		clearInterval(questionCounter);
		console.log('counter stopped');
	}
	}
	
	socket.on('connection', function() {
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