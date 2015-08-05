var path = require('path');
var Datastore = require('nedb');
var db = {
  questions: new Datastore({ filename: path.join(__dirname, 'questions.db'), autoload: true })
};

var questions = {
	questionWithID: function(questionId, callback) {
	  	db.questions.findOne({questionId:questionId}, 
			function(error, docs) {
				return callback(docs);
		}
	)},
	
	questionWithName: function(question, callback) {
		//console.log('Searching for question:'+question);
	  	db.questions.findOne({question:question}, 
			function(error, docs) {}
	)},
	
	allQuestions: function(callback) {
		//console.log('Fetching all questions from DB');
	  	db.questions.find({}, 
			function(error, docs) {
				return callback(docs);
			}
		)
	},
	
	insert: function(questionId, question, callback) {
	  db.questions.insert({questionId:questionId, question:question, answers: ['YES', 'NO', 'Dont Care']}, function (err, doc) {});
	}
};

module.exports = questions;