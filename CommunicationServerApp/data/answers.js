var path = require('path');
var Datastore = require('nedb');
var db = {
  answers: new Datastore({ filename: path.join(__dirname, 'answers.db'), autoload: true })
};

var answers = {
	answerForQuestionID: function(questionId, callback) {
	  	db.answers.findOne({questionId:questionId}, 
			function(error, docs) {
				return callback(docs);
		}
	)},
	
	answerForQuestionWithName: function(question, callback) {
	  	db.answers.findOne({question:question}, 
			function(error, docs) {
		}
	)},
	
	allAnswers: function(callback) {
		//console.log('Fetching all answers from DB');
	  	db.answers.find({}, 
			function(error, docs) {
			return callback(docs);
			}
		)
	},
	
	updateCountsForQuestionId: function(questionId, yesCount, noCount, dontCareCount, notAnswered, callback) {
	  db.answers.update({questionId:questionId},{ $set:{"yesCount":yesCount,"noCount":noCount,"dontCareCount":dontCareCount,"notAnswered":notAnswered}},{}, function (err, doc) { 
	  });
	},
	
	insert: function(data, callback) {
	  db.answers.insert(data, function (err, doc) { 
	  });
	}
};

module.exports = answers;