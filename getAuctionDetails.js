var mongoose=require('mongoose');
var dbobj=require('./createAuc_obj');
var es6=require("es6-promise");
var cta=require('./create_tables_auction');


function getD(req,res,id)
{
	mongoose.connect('mongodb://rvsingh31:obm123@ds129281.mlab.com:29281/obm');
		var db = mongoose.connection;
			db.on('error', console.error.bind(console, 'connection error:'));
			db.once('open', function() {
				console.log("connected..");
		});

	dbobj.findOne({_id:id},function(err,doc){
		doc.uploading="no";
		doc.save();
		cta(req,res,doc);
	});
}

module.exports=getD;