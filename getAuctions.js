var mongoose=require('mongoose');
var es6=require("es6-promise");
var dbobj=require('./createAuc_obj');
mongoose.Promise=es6.Promise;


function getAll(req,res,str)
{
	mongoose.connect('mongodb://rvsingh31:obm123@ds129281.mlab.com:29281/obm');
		var db = mongoose.connection;
			db.on('error', console.error.bind(console, 'connection error:'));
			db.once('open', function() {
				console.log("connected..");
		});

	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!

	var yyyy = today.getFullYear();
	if(dd<10){
		dd='0'+dd;
	} 
	if(mm<10){
		mm='0'+mm;
	} 
	var today = dd+'/'+mm+'/'+yyyy;
	
	var docs=[];
	
	if(str=='')
	{
		dbobj.find().cursor()
		.on('data', function(doc) { 
					docs.push(doc);
		})
		.on('end', function() {
					if(docs.length==0){ 
							res.json({auctions:'No Auctions to Show'})
					}
					else
					{
						res.send({auctions:JSON.stringify(docs)})
					} 
				});
	}
	else
	{
		dbobj.find({enabled:str}).cursor()
		.on('data', function(doc) { 
			if(doc.date==today)
			{
					docs.push(doc);
			}
		})
		.on('end', function() {
					if(docs.length==0){ 
							res.json({auctions:'No Auctions to Show'})
					}
					else
					{
						res.send({auctions:JSON.stringify(docs)})
					} 
				});
		}
	
}

module.exports=getAll;