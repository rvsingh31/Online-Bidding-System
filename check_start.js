var mongoose=require('mongoose');
var es6=require("es6-promise");
var dbobj=require('./createAuc_obj');
mongoose.Promise=es6.Promise;


function update(req,res,id)
{
		mongoose.connect('mongodb://rvsingh31:obm123@ds129281.mlab.com:29281/obm');
		var db = mongoose.connection;
			db.on('error', console.error.bind(console, 'connection error:'));
			db.once('open', function() {
				console.log("connected.. in check_start");
		});

		
		dbobj.findOne({ _id: id }, function (err, doc){	
			if(doc.start=="yes")
			{
				res.json({done:'yes'});
			}
			else
			{
				res.json({done:'no'});
			}
		});
		
	
}

module.exports=update;