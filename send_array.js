 var mongoose=require('mongoose');
var es6=require("es6-promise");
var dbobj=require('./dynamic_collection');
var sendproduct=require('./sendProduct');
var jwt=require('jsonwebtoken');
mongoose.Promise=es6.Promise;



function get_Array(a_id,prod,prod_count,dur)
{
		var store_info={
				auction_id:a_id,
				total:prod_count,
				duration:dur,
				products:prod
			};
		
		return store_info;
}

function calc_Difference(jointime,starttime,duration,total_products)
{
	var array={};
	total_time_for_auction=parseInt(duration)*parseInt(total_products);
	str_jt=jointime.split(':');
	str_st=starttime.split(':');
	
	jt_hour=parseInt(str_jt[0]);
	st_hour=parseInt(str_st[0]);
	jt_min=parseInt(str_jt[1]);
	jt_sec=parseInt(str_jt[2]);
	st_min=parseInt(str_st[1]);
	
	jt_total=(jt_hour*60)+jt_min;
	st_total=(st_hour*60)+st_min;
	left_sec=60-jt_sec;
	diff_total=jt_total-st_total;
		
	if(diff_total>=total_time_for_auction || diff_total<0)
	{
		array["resp"]="end";
		array["products"]="";
		array["left_time"]="";
		array["break"]="";

	}
	else
	{
		extra_time=diff_total%(parseInt(duration));
		skipped_products=diff_total/(parseInt(duration));
		left_time=duration-extra_time-1;
		array["resp"]="";
		array["products"]=skipped_products;
		var t=left_time+":"+left_sec;
		array["left_time"]=t;
		if(left_time<0)
		{
				array["break"]="yes";
		}
		else
		{
				array["break"]="";
		}
	

	}
	return array;
	
}

 function send_array(io,socket,socket_id,auc_id,time)
 {
	 mongoose.connect('mongodb://rvsingh31:obm123@ds129281.mlab.com:29281/obm');
		var db = mongoose.connection;
			db.on('error', console.error.bind(console, 'connection error:'));
			db.once('open', function() {
				console.log("connected.. in send_array");
		});

		dbobj.findOne({ auction_id: auc_id }, function (err, doc){
		
			total_products=doc.total_products;
			duration=doc.duration;
			jointime=time;
			starttime=doc.products[0].starttime;
			returned_array=calc_Difference(jointime,starttime,duration,total_products);
			if(returned_array["resp"]=="end")
			{
					io.sockets.connected[socket_id].emit('auction_finish',auc_id);
			}
			else
			{
						skip=parseInt(returned_array["products"]);
						left_t=returned_array["left_time"];
						break_st=returned_array["break"];
						if(break_st=="")
						{
								temp_skip=1;
								var products={};
								for(var i=1;i<=total_products;i++)
								{
									var object="product"+i;
									if(temp_skip<=skip)
									{
										products[object]='1';	
										temp_skip++;
									}
									else
									{
										products[object]='0';	
									}
								}
				
								final_data_to_store=get_Array(auc_id,products,total_products,duration);
								var token = jwt.sign({ auction_data:final_data_to_store}, 'RavinderSingh3104');
								//	io.sockets.connected[socket_id].emit('store_data',token);
								//	io.sockets.connected[socket_id].emit('left_time',left_t);
									sendproduct(io,socket,socket_id,token,left_t);
								
							}
						else
						{
							//emit break event 
						}
			}
		
		});
	
 }
 
 module.exports=send_array;