var mongoose=require('mongoose');
var es6=require("es6-promise");
var dbobj=require('./dynamic_collection');
var sendproduct=require('./sendProduct');
var jwt=require('jsonwebtoken');
mongoose.Promise=es6.Promise;
var globalvar=require('./globals');
var bid_data_to_store=globalvar;


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


function handle(io,socket,data,all_users)
{
	
	var decoded=jwt.verify(data.auction_data,'RavinderSingh3104');
	products=decoded.auction_data.products;
	auc_id=decoded.auction_data.auction_id;
	size=decoded.auction_data.total;
	duration=decoded.auction_data.duration;
	var count_of_occurences=0;
	var i;
	for(i=1;i<=size;i++)
	{
		var object="product"+i;
		if(products[object]=="1")
		{
			count_of_occurences++;
			continue;
		}
		else
		{
			products[object]="1";
			count_of_occurences++;
			break;
		}
	}
	if(count_of_occurences==size)
	{
			final_value=bid_data_to_store.value;
			winner_user=bid_data_to_store.user;
		dbobj.findOne({ auction_id: auc_id }, function (err, doc){
			doc.products[count_of_occurences-1].winner=winner_user;
			doc.products[count_of_occurences-1].sell_price=final_value;
			doc.save();
		});
		io.sockets.connected[data.id].emit('auction_finish',auc_id);
	}
	else
	{
		final_data_to_store=get_Array(auc_id,products,size,duration);
		console.log(JSON.stringify(final_data_to_store));
		var token = jwt.sign({ auction_data:final_data_to_store}, 'RavinderSingh3104');
		left_t=duration+":0";
		console.log("sending");
		//store final bid and make the global variable null
		//then send new product
			final_value=bid_data_to_store.value;
			winner_user=bid_data_to_store.user;
		dbobj.findOne({ auction_id: auc_id }, function (err, doc){
			doc.products[count_of_occurences-1].winner=winner_user;
			doc.products[count_of_occurences-1].sell_price=final_value;
			doc.save();
		});
		bid_data_to_store.user='';
		bid_data_to_store.value=0;
		sendproduct(io,socket,data.id,token,left_t);
	}
}

module.exports=handle;