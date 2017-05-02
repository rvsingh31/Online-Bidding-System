var mongoose=require('mongoose');
var es6=require("es6-promise");
var dbobj=require('./createAuc_obj');
mongoose.Promise=es6.Promise;

var time;
var date;
function formatDate(date)
{
	date_arr=date.split('/');
	str_date="";
	switch(date_arr[1])
	{
			case '01':str_date="January ";
			break;
			case '02':str_date="February ";
			break;
			case '03':str_date="March ";
			break;
			case '04':str_date="April ";
			break;
			case '05':str_date="May ";
			break;
			case '06':str_date="June ";
			break;
			case '07':str_date="July ";
			break;
			case '08':str_date="August ";
			break;
			case '09':str_date="September ";
			break;
			case '10':str_date="October ";
			break;
			case '11':str_date="November ";
			break;
			case '21':str_date="December ";
			break;
	}
	
	str_date+=date_arr[0]+" "+date_arr[2];
	
	return str_date;
	
}
function update(req,res,id)
{
		mongoose.connect('mongodb://rvsingh31:obm123@ds129281.mlab.com:29281/obm');
		var db = mongoose.connection;
			db.on('error', console.error.bind(console, 'connection error:'));
			db.once('open', function() {
				console.log("connected..");
		});

		dbobj.findOne({ _id: id }, function (err, doc){
			now_time=new Date().getTime();
			date=doc.date;
			auc_date=formatDate(date);
			time=doc.starttime;
			auc_date+=" "+time+":00";
			res.json({date:auc_date,now:now_time});
	
		});
		
}

module.exports=update;