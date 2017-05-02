var mongoose=require('mongoose');
var dbobj=require('./createAuc_obj');
var auc_table=require('./dynamic_collection');
var db_pro_obj=require('./upload_obj'); 

	var all_docs=[];
	var time;
	var duration;
			
		var all_products=[];
	
		var data_to_store={
				auction_id:'',
				total_products:'',
				duration:'',
				products:all_products
			};
		function createProduct(name,desc,id,o_id,st,et,bp,i)
		{
			return product={
					product_name:name,
					product_desc:desc,
					product_id:id,
					owner_id:o_id,
					starttime:st,
					endtime:et,
					base_price:bp,
					winner:'',
					sell_price:'',
					img:i
				};
		}
	
function getEndTime(starttime,duration)
{
		
						var str_hours,str_minutes;
						var splittime = starttime.split(':');
						var hours=parseInt(splittime[0],10);
						var minutes=parseInt(splittime[1],10);
						minutes=minutes+parseInt(duration,10);
					
					if(minutes>=60)
						{
							hours+=1;
							minutes%=60;
						}
						if(hours<10)
						{
							str_hours="0"+hours;
						}
						else
						{
							str_hours=hours;
						}
						if(minutes<10)
						{
							str_mins="0"+minutes;
						}
						else
						{
							str_mins=minutes;
						}
						endtime=str_hours+":"+str_mins;
						
					return endtime;
}


function getStartTime(newtime)
{
		
						var str_hours,str_minutes;
						var splittime = newtime.split(':');
						var hours=parseInt(splittime[0],10);
						var minutes=parseInt(splittime[1],10);
						minutes=minutes+1;
					
					if(minutes>=60)
						{
							hours+=1;
							minutes%=60;
						}
						if(hours<10)
						{
							str_hours="0"+hours;
						}
						else
						{
							str_hours=hours;
						}
						if(minutes<10)
						{
							str_mins="0"+minutes;
						}
						else
						{
							str_mins=minutes;
						}
						starttime=str_hours+":"+str_mins;
						
					return starttime;
}

	
function create(req,res,d)
{
	mongoose.connect('mongodb://rvsingh31:obm123@ds129281.mlab.com:29281/obm');
		var db = mongoose.connection;
			db.on('error', console.error.bind(console, 'connection error:'));
			db.once('open', function() {
				console.log("connected..");
		});

	
	starttime=d.starttime;
	duration=d.duration;
	auc_id=d._id;
	var counter=0;
	all_docs=[];
	all_products=[];
	db_pro_obj.find({auction_id:auc_id, verified: "yes" }).cursor()
	.on('data',function(doct){
					all_docs.push(doct);
	})
	.on('end',function(){
				all_docs.forEach(function(doc,value){
					counter++;
					endtime=getEndTime(starttime,duration);
					own_id=mongoose.Types.ObjectId(doc.owner);
					console.log(own_id+"\n");
					new_product=createProduct(doc.name,doc.desc,doc._id,own_id,starttime,endtime,doc.base_price,doc.img);
					starttime=getStartTime(endtime);	
					all_products.push(new_product);
				})
					data_to_store.duration=duration;
					data_to_store.products=all_products;
					data_to_store.auction_id=auc_id;
					data_to_store.total_products=counter;

					//store in database

					var store_it=auc_table(data_to_store);
						store_it.save(function (err) {
							if (err) {console.error(err);}
							else{
								console.log("stored...");
								res.json({done:'yes'});
							}
					});
				
			
	})
	 
}
 
 module.exports=create;