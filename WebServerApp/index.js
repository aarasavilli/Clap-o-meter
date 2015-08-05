var express = require('express');
var app=express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var interIO = require('socket.io-client');
var communicationServerSocket = interIO.connect('http://localhost:8001');

app.get('/admin', function(req, res){
  res.sendFile(__dirname + '/adminconsole.html');
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.use(express.static(__dirname + '/public'));

io.on('connection', function(client){
	console.log('Someone connected');
	client.on('updateClap',function(counter){
		//console.log('claps update' + counter);
		io.emit('updateClapinUI',counter);
	});
	
	client.on('questionResponse',function(id,result){
       //console.log(id+"\n"+result.question+result.yesCount+result.noCount+result.dontCareCount);
		io.emit('UpdateQuestionResponseinUI',id,result);
	});
	
	client.on('event:sendquestionselected',function(questionno){
  		// console.log( 'inside event');
		communicationServerSocket.emit('sendquestionselected',questionno);
	});
	
	client.on('gotresponseforquestionselected',function(result){
		io.emit('gotresponseforquestionselectedOnUI',result);
	});
	
	client.on('dataForGraph',function(data){
		io.emit('dataForGraphToUI',data);
	});
	
	client.on('nameChanged',function(name){
		communicationServerSocket.emit('nameChanged',name);
	})
});

io.on('disconnect', function(){
    console.log('user disconnected');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
