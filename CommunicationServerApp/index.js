var express = require('express');
var app=express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var interIO = require('socket.io-client');
var webServerSocket = interIO.connect('http://localhost:3000');

var claps = require('./data/claps');
var questions = require('./data/questions');
var answers = require('./data/answers');

var counter = 0;
var questionArray= 
					[
					{ "question" : "question 0",
					  "questionId" : 0,
					  "yesCount" : 0,
					  "noCount" : 0,
					  "dontCareCount" : 0,
					  "notAnswered" : 0
					},
					{ "question" : "question 1",
					   "questionId" : 1,
					  "yesCount" : 0,
					  "noCount" : 0,
					  "dontCareCount" : 0,
					  "notAnswered" : 0
					},
					{ "question" : "question 2",
					   "questionId" : 2,
					  "yesCount" : 0,
					  "noCount" : 0,
					  "dontCareCount" : 0,
					  "notAnswered" : 0
					},
					{ "question" : "question 3",
					   "questionId" : 3,
					  "yesCount" : 0,
					  "noCount" : 0,
					  "dontCareCount" : 0,
					  "notAnswered" : 0
					},
					{ "question" : "question 4",
					   "questionId" : 4,
					  "yesCount" : 0,
					  "noCount" : 0,
					  "dontCareCount" : 0,
					  "notAnswered" : 0
					}
					];

function insertQuestionsToDB() {
	console.log('Inserting data');

	questions.questionWithID(0, function(docs){
		if (docs == null) {
			questions.insert(0, 'Should Friday be an optional holiday ?', function(){});
		}
	});
	
	questions.questionWithID(1, function(docs){
		if (docs == null) {
			questions.insert(1, 'Do you want the release day of Baahubali-2 to be a national holiday ?', function(){});
		}
	});
	
	questions.questionWithID(2, function(docs){
		if (docs == null) {
			questions.insert(2, 'Are you interested to enroll for hobby club at Alliance ?', function(){});
		}
	});
	
	questions.questionWithID(3, function(docs){
		if (docs == null) {
			questions.insert(3, 'Is Whatsapp dominating Facebook ?', function(){});
		}
	});
	
	questions.questionWithID(4, function(docs){
		if (docs == null) {
			questions.insert(4, 'Did you answer all previous questions ?', function(){});
		}
	});
	
	/*questions.questionWithName('Did you answer all previous questions.', function(docs){
		console.log('Name:'+docs.question);
	});*/
}

function updateArray() {
	questions.allQuestions(function(docs){
		//console.log('Docs are:'+docs);
		for (var i = 0; i < docs.length; i++) {
			//console.log('Name--->:'+docs[i].question);
			//console.log('Array:'+questionArray[i].question);
			questionArray[docs[i].questionId].question = docs[i].question;
		}
	});
}

webServerSocket.on('connect', function(socket) { 
    console.log('Connected! to Web server');
});

var countdown = 1000;  

setInterval(function() {  
  countdown--;
  if(counter > 0)counter--;
	//  if(counter > 0){counter=counter-Math.round(0.1*counter);};
  io.sockets.emit('timer', { countdown: countdown });
  io.emit('updateClap',counter);
  webServerSocket.emit('updateClap',counter);
}, 1000);

setInterval(function() {  
	claps.add(counter, new Date(), function(){});
}, 30000);

io.on('connection', function(socket){
	insertQuestionsToDB();
	updateArray();
	var question;
	// Emit questions logic : read a question at a regular interval and emit question to mobile client
	var questionCounter = setInterval(function () {myTimer()}, 30000);
	
	var queNumber = 0;
	function myTimer() {
		if(queNumber < questionArray.length){
			questions.questionWithID(queNumber, function(doc){
				if(doc) {
					question = doc.question;
					//console.log('question : '+question );
					socket.emit('showQuestion', doc.questionId, question, doc.answers);
					//console.log('question : '+ questionArray[queNumber].question);
					//socket.emit('showQuestion', questionArray[queNumber].question);
					queNumber = queNumber +1;		
				};
			});
		}
		else {
			answers.allAnswers(function(docs) {
				//console.log('Docs fetched here are:'+docs);
				if (docs.length > 0) {
					for (var i = 0; i < docs.length; i++) {
						answers.answerForQuestionID(i, function(docResult) {
							//console.log('Updating entries');
							//console.log('Details are:YesCount:'+docResult.yesCount+'--->No Count:'+docResult.noCount+'--->DontCare:'+docResult.dontCareCount);
							answers.updateCountsForQuestionId(questionArray[docResult.questionId].questionId,
														questionArray[docResult.questionId].yesCount,
														questionArray[docResult.questionId].noCount,
														questionArray[docResult.questionId].dontCareCount,
														questionArray[docResult.questionId].notAnswered, function(){});
							});
					}
				}
				else {
					//console.log('Inserting entries');
					answers.insert(questionArray, function(){});
				}
			});
			clearInterval(questionCounter);
			console.log('counter stopped');
		}
	}
	
	//Receive response from mobile client
	socket.on('questionResponse', function(questionID, response) {
		//console.log('Received response for ID: '+ questionID + ' - ' + response);
		questionArray[questionID][response] = questionArray[questionID][response] + 1;
		console.log('Stored : ' + questionArray[questionID][response]);
		
		//Emit the user response to web server
		webServerSocket.emit('questionResponse',questionID,questionArray[questionID]);
	});
	
	socket.on('sendquestionselected', function(reqQuestionID) {
		//console.log('Recevied test');
		answers.answerForQuestionID(reqQuestionID, function(docResult) {
			webServerSocket.emit('gotresponseforquestionselected', docResult);
		});
	})
	
    socket.on('event:new:clap',function(callback){
		counter = counter+1;
		console.log('clap count: '+counter);
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