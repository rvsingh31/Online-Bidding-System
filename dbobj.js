		var mongoose=require('mongoose');
		var es6=require("es6-promise");
		mongoose.Promise=es6.Promise;

		var r_form=mongoose.Schema({
			fname:String,
			lname:String,
			uname:String,
			password:String,
			contact:String,
		});
	
		module.exports=mongoose.model('users',r_form);
