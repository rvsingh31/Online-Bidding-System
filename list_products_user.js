  var mongoose=require('mongoose');
var es6=require("es6-promise");
var dbobj=require('./upload_obj');
mongoose.Promise=es6.Promise;
var jwt=require('jsonwebtoken');


function getAll(req,res,str)
{
		mongoose.connect('mongodb://rvsingh31:obm123@ds129281.mlab.com:29281/obm');
		var db = mongoose.connection;
			db.on('error', console.error.bind(console, 'connection error:'));
			db.once('open', function() {
				console.log("connected..");
		});

		var docs=[];
		var decoded=jwt.verify(str, 'RavinderSingh3104');
		
		dbobj.find({owner:decoded.ac_id}).populate('auction_id').cursor()
		.on('data', function(doc) { 
					docs.push(doc);
		})
		.on('end', function() {
					if(docs.length==0){ 
							res.json({products:'No Products Listed'})
					}
					else
					{
						res.send({products:JSON.stringify(docs)})
					} 
				});
}


module.exports=getAll;