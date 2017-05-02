var mongoose=require('mongoose');
var es6=require("es6-promise");
mongoose.Promise=es6.Promise;


mongoose.connect('mongodb://rvsingh31:obm123@ds129281.mlab.com:29281/obm');
		var db = mongoose.connection;
			db.on('error', console.error.bind(console, 'connection error:'));
			db.once('open', function() {
				console.log("connected..");
		});
		
module.exports=mongoose;