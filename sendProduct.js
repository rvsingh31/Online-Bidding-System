var mongoose=require('mongoose');
var es6=require("es6-promise");
var user_info=require('./dbobj');
var auction_info=require('./dynamic_collection');
var jwt=require('jsonwebtoken');
mongoose.Promise=es6.Promise;
var async=require('async');
var globalvar=require('./globals');
 
 var bid_value=globalvar;
 
 
 function getProd(prod_name,prod_desc,o_name,bp,img,cont)
 {
	 obj={
	 name:prod_name,
	 desc:prod_desc,
	 owner_name:o_name,
	 base_price:bp,
	 img_url:img,
	 contact:cont
	 };
	 
	 return obj;
 }

 
 function sendP(io,socket,socket_id,token,left_t)
 {
	 console.log("in SendP");
	var prod_id=0;
	var decoded=jwt.verify(token,'RavinderSingh3104');
	var auc_id=decoded.auction_data.auction_id;
	var size=decoded.auction_data.total;
	var products=decoded.auction_data.products;
	for(i=1;i<=size;i++)
	{
		var object="product"+i;
		if(products[object]=="1")
		{
			prod_id++;
			continue;
		}
		else
		{
			products[object]="1";
			break;
		}
	}	
	
	async.waterfall([
		function GetProductFromDB(next) {
				auction_info.findOne({auction_id : auc_id}).populate('owner_id').exec(function (err, result) {
				if (!result) {
					console.log('Not Found');
				} else {
					next(null,result);
				}
			});
		}],function(err,d){
				product=d.products[prod_id];
				prod_name=product.product_name;
				prod_desc=product.product_desc;
				bp=product.base_price;
				if(bid_value.value=='0')
				{
						bid_value.value=product.base_price;
						bid_value.user="OWNER";
				}
				img_url=product.img; 
				owner_name=product.owner_id.fname + " "+product.owner_id.lname;
				contact=product.owner_id.contact;		
					final_data=getProd(prod_name,prod_desc,owner_name,bp,img_url,contact);
					console.log(final_data);
					io.sockets.connected[socket_id].emit('new_product',JSON.stringify(final_data));
					io.sockets.connected[socket_id].emit('store_data',token);
					io.sockets.connected[socket_id].emit('left_time',left_t);
					io.sockets.connected[socket.id].emit('bid_status',JSON.stringify(bid_value));
		});				

}
 
 module.exports=sendP;