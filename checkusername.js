		var mongoose=require('mongoose');
		var es6=require("es6-promise");
		var express=require('express');
		var app=express();
		var dbobj=require('./dbobj');
		mongoose.Promise=es6.Promise;
	

function check(params,res)
{
	mongoose.connect('mongodb://rvsingh31:obm123@ds129281.mlab.com:29281/obm');
		var db = mongoose.connection;
			db.on('error', console.error.bind(console, 'connection error:'));
			db.once('open', function() {
				console.log("connected..");
		});

			console.log(params.username);
			var data={};
			dbobj.findOne({ 'uname': params.username}, '_id', function (err, d) {
					if (err) return handleError(err);
					if(d==null)
					{
						console.log("no");
						data.ret="no";
					}
					else
					{
						console.log("yes");
						data.ret="yes";
					}
			//				mongoose.connection.close();
					res.send(JSON.stringify(data));
			});
	
}

module.exports=check;