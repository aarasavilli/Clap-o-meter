var path = require('path');
var Datastore = require('nedb');
var db = {
  answers: new Datastore({ filename: path.join(__dirname, 'answers.db'), autoload: true })
};

var answers = {
	answerForQuestionID: function(questionId, callback) {
		console.log('Searching for question id:'+questionId);
	  	db.answers.findOne({questionId:questionId}, 
			function(error, docs) {
				 console.log('Following record is fetched:QuestionID'+docs.questionId+'Question:'+docs.question);
				return callback(docs);
		}
	)},
	
	answerForQuestionWithName: function(question, callback) {
		//console.log('Searching for question:'+question);
	  	db.answers.findOne({question:question}, 
			function(error, docs) {
				 //console.log('Following record is fetched:'+'QuestionID'+docs.questionId+'---Question:'+docs.question);
		}
	)},
	
	allDetails: function(callback) {
		console.log('Fetching all questions from DB');
	  	db.answersanswers.find({}, 
			function(error, docs) {
				console.log('Returning all questions from DB'+docs);
				return callback(docs);
		}
	)},
	
	insert: function(data, callback) {
	  db.answers.insert(data, function (err, doc) { 
	  	//console.log('Following record is inserted successfully:'+'QuestionID'+doc.questionId+'Question:'+doc.question);
	  });
	}
};

module.exports = answers;