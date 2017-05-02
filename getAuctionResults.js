var mongoose=require('mongoose');
var auc_table=require('./dynamic_collection');


var total;

function get(req,res,data)
{
	var data_to_send="";
	mongoose.connect('mongodb://rvsingh31:obm123@ds129281.mlab.com:29281/obm');
		var db = mongoose.connection;
			db.on('error', console.error.bind(console, 'connection error:'));
			db.once('open', function() {
				console.log("connected..");
		});

			auc_table.findOne({ auction_id: data.auc_id }, function (err, doc){
				total=doc.total_products;
				for(var i=0;i<parseInt(total);i++)
				{
					product_name=doc.products[i].product_name;
					product_bp=doc.products[i].base_price;
					product_sp=doc.products[i].sell_price;
					product_winner=doc.products[i].winner;
					
					var d="<div><h6>PRODUCT-NAME:"+product_name+"</h6><h6>PRODUCT BASE-PRICE:"+product_bp+"</h6><h6>PRODUCT SOLD AT:"+product_sp+"</h6><h6>PRODUCT SOLD TO:"+product_winner+"</h6></div><br><div class='divider'></div><br>";
					data_to_send+=d;
				}
			res.send(data_to_send);
			
			});

}

module.exports=get;
