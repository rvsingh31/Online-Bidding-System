var mongoose=require('mongoose');
var es6=require("es6-promise");
mongoose.Promise=es6.Promise;
auto=require('mongoose-autopopulate');

	var new_table=mongoose.Schema({
		auction_id:String,
		total_products:String,
		duration:String,
		products:[new mongoose.Schema({
							product_name:String,
							product_desc:String,
							product_id:String,
							owner_id:{type: mongoose.Schema.Types.ObjectId , ref: 'users',autopopulate:true},
							starttime:String,
							endtime:String,
							base_price:String,
							winner:String,
							sell_price:String,
							img:String
				},{_id:false})]
	});
	
	new_table.plugin(auto);
		


module.exports= mongoose.model('live_auctions',new_table);	
