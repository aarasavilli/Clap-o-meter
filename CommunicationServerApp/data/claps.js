var path = require('path');
var Datastore = require('nedb');
var db = {
  claps: new Datastore({ filename: path.join(__dirname, 'claps.db'), autoload: true })
};

var claps = {
  add: function(counter,date, callback) {
	  db.claps.insert({counter:counter, day:date.getDate(), year: date.getFullYear(), month:date.getMonth()+1, hours:date.getHours(), minutes:date.getMinutes(), seconds:date.getSeconds(), milliseconds:date.getMilliseconds(), time:date.getTime(), dateValue:date.toDateString()}, callback);
  }
};

module.exports = claps;