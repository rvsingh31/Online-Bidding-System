  var mongoose=require('mongoose');
var es6=require("es6-promise");
var dbobj=require('./dbobj');
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
		
			dbobj.findOne({ _id: str }, function (err, doc){
				if(err)
				{
					res.json({owner:'Not Found'});
				}
				else
				{
					docs.push(doc);
					res.json({owner:JSON.stringify(docs)});
				}
			
		});
		
}


module.exports=getAll;