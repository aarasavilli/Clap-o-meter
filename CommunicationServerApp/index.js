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
					{ "question" : "question 0",
					  "yesCount" : 0,
					  "noCount" : 0,
					  "dontCareCount" : 0,
					  "notAnswered" : 0
					},
					{ "question" : "question 1",
					  "yesCount" : 0,
					  "noCount" : 0,
					  "dontCareCount" : 0,
					  "notAnswered" : 0
					},
					{ "question" : "question 2",
					  "yesCount" : 0,
					  "noCount" : 0,
					  "dontCareCount" : 0,
					  "notAnswered" : 0
					},
					{ "question" : "question 3",
					  "yesCount" : 0,
					  "noCount" : 0,
					  "dontCareCount" : 0,
					  "notAnswered" : 0
					},
					{ "question" : "question 4",
					  "yesCount" : 0,
					  "noCount" : 0,
					  "dontCareCount" : 0,
					  "notAnswered" : 0
					}
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
	
	// Emit questions logic : read a question at a regular interval and emit question to mobile client
	var questionCounter = setInterval(function () {myTimer()}, 10000);
	var queNumber = 0;
	function myTimer() {
	if(queNumber < questionArray.length){
		//console.log('number :' + queNumber + ' question : '+ questionArray[queNumber].question);
		socket.emit('showQuestion', queNumber, questionArray[queNumber].question);
		queNumber = queNumber +1;
	}
	else{
		clearInterval(questionCounter);
		//console.log('counter stopped');
	}
	}
	
	//Receive response from mobile client
	socket.on('questionResponse', function(questionID, response) {
		console.log('Received response for ID: '+ questionID + ' - ' + response);
		questionArray[questionID][response] = questionArray[questionID][response] + 1;
		console.log('Stored : ' + questionArray[questionID][response]);
		
		//Emit the user response to web server
		webServerSocket.emit('questionResponse',questionID,questionArray[questionID]);
	});
	
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