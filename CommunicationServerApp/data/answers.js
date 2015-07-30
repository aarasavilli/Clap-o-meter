var path = require('path');
var Datastore = require('nedb');
var db = {
  answers: new Datastore({ filename: path.join(__dirname, 'answers.db'), autoload: true })
};

var answers = {
	answerForQuestionID: function(questionId, callback) {
		//console.log('Searching for question id:'+questionId);
	  	db.answers.findOne({questionId:questionId}, 
			function(error, docs) {
				// console.log('Following record is fetched:QuestionID'+docs.questionId+'Question:'+docs.question);
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
	
	allAnswers: function(callback) {
		//console.log('Fetching all answers from DB');
	  	db.answers.find({}, 
			function(error, docs) {
				//console.log('Returning all answers from DB'+docs);
				for (var i = 0; i < docs.length; i++) {
					console.log('Name:'+docs[i].question);
				}
			return callback(docs);
			}
		)
	},
	
	updateCountsForQuestionId: function(questionId, yesCount, noCount, dontCareCount, notAnswered, callback) {
	  db.answers.update({questionId:questionId},{ $set:{"yesCount":yesCount,"noCount":noCount,"dontCareCount":dontCareCount,"notAnswered":notAnswered}},{}, function (err, doc) { 
	  	//console.log('Following record is updated successfully:'+'QuestionID'+doc.questionId+'Question:'+doc.question);
	  });
	},
	
	insert: function(data, callback) {
	  db.answers.insert(data, function (err, doc) { 
	  	//console.log('Following record is inserted successfully:'+'QuestionID'+doc.questionId+'Question:'+doc.question);
	  });
	}
};

module.exports = answers;