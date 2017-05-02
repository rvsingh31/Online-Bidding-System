   var mongoose=require('mongoose');
var es6=require("es6-promise");
var dbobj=require('./dynamic_collection');
mongoose.Promise=es6.Promise;

function getAll(req,res,str)
{
		mongoose.connect('mongodb://rvsingh31:obm123@ds129281.mlab.com:29281/obm');
		var db = mongoose.connection;
			db.on('error', console.error.bind(console, 'connection error:'));
			db.once('open', function() {
				console.log("connected..");
		});

		var docs=[];
			
		dbobj.find({ products: { $elemMatch: { winner: str } } }).cursor()
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