var path = require('path');
var Datastore = require('nedb');
var db = {
  questions: new Datastore({ filename: path.join(__dirname, 'questions.db'), autoload: true })
};

var questions = {
	questionWithID: function(questionId, callback) {
		//console.log('Searching for question id:'+questionId);
	  	db.questions.findOne({questionId:questionId}, 
			function(error, docs) {
				 //console.log('Following record is fetched:QuestionID'+docs.questionId+'Question:'+docs.question);
				return callback(docs);
		}
	)},
	
	questionWithName: function(question, callback) {
		//console.log('Searching for question:'+question);
	  	db.questions.findOne({question:question}, 
			function(error, docs) {
				 //console.log('Following record is fetched:'+'QuestionID'+docs.questionId+'---Question:'+docs.question);
		}
	)},
	
	allQuestions: function(callback) {
		//console.log('Fetching all questions from DB');
	  	db.questions.find({}, 
			function(error, docs) {
				/*console.log('Returning all questions from DB'+docs);
				for (var i = 0; i < docs.length; i++) {
					console.log('Name:'+docs[i].question);
				}*/
				return callback(docs);
			}
		)
	},
	
	insert: function(questionId, question, callback) {
	  db.questions.insert({questionId:questionId, question:question, answers: ['YES', 'NO', 'Dont Care']}, function (err, doc) { 
	  	//console.log('Following record is inserted successfully:'+'QuestionID'+doc.questionId+'Question:'+doc.question);
	  });
	}
};

module.exports = questions;