var express = require('express');
var app=express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var interIO = require('socket.io-client');
var communicationServerSocket = interIO.connect('http://localhost:8001');
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
app.use(express.static(__dirname + '/public'));

io.on('connection', function(client){
	console.log('Someone connected');
	client.on('updateClap',function(counter){
	console.log('claps update' + counter);
	io.emit('updateClapinUI',counter);
	//io.emit('UpdateQuestionCountinUI','[{"question":"what is the count","yescount":"20","nocount":"20","dontcarecount":"20"}]');
	});
	client.on('UpdateQuestionCount',function(result){

	io.emit('UpdateQuestionCountinUI',result);
	});
	client.on('event:sendquestionselected',function(questionno){

	communicationServerSocket.emit('UpdateQuestionCountinUI',result);
	});
	client.on('gotresponseforquestionselected',function(result){

	io.emit('gotresponseforquestionselected',result);
	});
	
});

io.on('disconnect', function(){
    console.log('user disconnected');
  });
http.listen(3000, function(){
  console.log('listening on *:3000');
});



