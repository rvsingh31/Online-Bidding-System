  var mongoose=require('mongoose');
var es6=require("es6-promise");
var dbobj=require('./createAuc_obj');
var dbobj2=require('./dynamic_collection');
mongoose.Promise=es6.Promise;


function update(req,res,id)
{
		mongoose.connect('mongodb://rvsingh31:obm123@ds129281.mlab.com:29281/obm');
		var db = mongoose.connection;
			db.on('error', console.error.bind(console, 'connection error:'));
			db.once('open', function() {
				console.log("connected..");
		});

		dbobj.remove({ _id: id }, function (err){
			if(err)
			{
				console.log(err);
			}
			else
			{
				dbobj2.remove({ _id: id }, function (err){
					if(err)
					{
						console.log(err);
					}
					else
					{
						res.json({done:"yes"});
					}
				});
			}
		});
		
}

module.exports=update;