var mongoose=require('mongoose');
var es6=require("es6-promise");
var dbobj=require('./dbobj');
mongoose.Promise=es6.Promise;

function register(req,data,res){
	mongoose.connect('mongodb://rvsingh31:obm123@ds129281.mlab.com:29281/obm');
		var db = mongoose.connection;
			db.on('error', console.error.bind(console, 'connection error:'));
			db.once('open', function() {
				console.log("connected..");
		});

	console.log("in register.js...");
	
	var new_reg=dbobj(data);	
		new_reg.save(function (err) {
			if (err) {console.error(err);}
			else{console.log("stored...");}
		});
			res.send({msg:'Account Created.Proceed to LOG IN!'});
			console.log("response sent");
}	

module.exports = register;