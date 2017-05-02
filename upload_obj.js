		var mongoose=require('mongoose');
		var es6=require("es6-promise");
		mongoose.Promise=es6.Promise;

		var r_form=mongoose.Schema({
			name:{type: String ,unique:true},
			desc:String,
			base_price:String,
			owner:{type: mongoose.Schema.Types.ObjectId , ref: 'users',autopopulate:true},
			img:String,
			auction_id:{type: mongoose.Schema.Types.ObjectId , ref: 'auctions',autopopulate:true},
			verified:String
		});
	
		module.exports=mongoose.model('products',r_form);
