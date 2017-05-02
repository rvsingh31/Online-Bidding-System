 		var mongoose=require('mongoose');
		var es6=require("es6-promise");
		mongoose.Promise=es6.Promise;

		var r_form=mongoose.Schema({
			name:{type: String ,unique:true},
			date:String,
			duration:String,
			starttime:String,
			enabled:String,
			start:String,
			uploading:String
		});
	
		module.exports=mongoose.model('auctions',r_form);
