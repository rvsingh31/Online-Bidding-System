var mongoose=require('mongoose');
var es6=require("es6-promise");
var dbobj=require('./createAuc_obj');
mongoose.Promise=es6.Promise;
var jwt=require('jsonwebtoken');

function create(req,tp,res)
{
	
	mongoose.connect('mongodb://rvsingh31:obm123@ds129281.mlab.com:29281/obm');
		var db = mongoose.connection;
			db.on('error', console.error.bind(console, 'connection error:'));
			db.once('open', function() {
				console.log("connected..");
		});

	var decoded=jwt.verify(tp, 'RavinderSingh3104');
	console.log(decoded);
	data_to_store=decoded.details;
	console.log(data_to_store);
	
	
	var data={
		name:'',
		date:'',
		duration:'',
		starttime:'',
		enabled:'no',
		start:'no',
		uploading:'yes'
	};
	
	data.name=data_to_store.name;
	data.date=data_to_store.dated;
	data.duration=data_to_store.duration;
	data.starttime=data_to_store.time;
	
	var final_data=JSON.stringify(data);  
					var new_auction=dbobj(JSON.parse(final_data));
						new_auction.save(function (err) {
							if (err) {console.error(err);}
							else{
									res.send({msg:'Created Successfully'});
							}
					});
		
	}

module.exports=create;