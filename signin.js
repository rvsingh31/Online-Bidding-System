		var mongoose=require('mongoose');
		var es6=require("es6-promise");
		var ns=require('node-session');
		var express=require('express');
		var app=express();
		var dbobj=require('./dbobj');
		var jwt=require('jsonwebtoken');
		mongoose.Promise=es6.Promise;
		var session = new ns({secret: 'Q3UBzdH9GEfiRCTKbi5MTPyChpzXLsTD'});

		
		function signin(rdata,req,res)
		{
			mongoose.connect('mongodb://rvsingh31:obm123@ds129281.mlab.com:29281/obm');
			var db = mongoose.connection;
				db.on('error', console.error.bind(console, 'connection error:'));
				db.once('open', function() {
					console.log("connected..");
			});

			console.log("in signin.js...");

			dbobj.findOne({ 'uname': rdata.rname,'password': rdata.rpassword }, 'uname _id', function (err, d) {
					if (err) return handleError(err);
					console.log("DATA:RECEIVED---"+d);
					if(d==null)
					{
							res.send({msg:'Incorrect Credentials',location:''});
					}
					else
					{
						var token = jwt.sign({ ac_id: d._id}, 'RavinderSingh3104');
								res.json({msg:'',location:'main.html',t:token,uname:d.uname});
					}
		});
		
	
		}

		module.exports=signin;