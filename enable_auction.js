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
				console.log("connected..");
		});

		dbobj.findOne({ _id: id }, function (err, doc){
			doc.enabled = 'yes';
			doc.save();
		});
		res.json({done:'yes'});
	
}

module.exports=update;