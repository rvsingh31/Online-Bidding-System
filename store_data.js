var mongoose=require('mongoose');
var es6=require("es6-promise");
var dbobj=require('./upload_obj');
mongoose.Promise=es6.Promise;
var fs=require('fs');
var jwt=require('jsonwebtoken');
var path = require('path');  


 function upload(req,token,res)
 {
	 mongoose.connect('mongodb://rvsingh31:obm123@ds129281.mlab.com:29281/obm');
		var db = mongoose.connection;
			db.on('error', console.error.bind(console, 'connection error:'));
			db.once('open', function() {
				console.log("connected..");
		});

		console.log("in store_data.js...");
		
		var decoded=jwt.verify(token, 'RavinderSingh3104');
		var f1=JSON.parse(decoded.fields);
		var f2=JSON.parse(decoded.files);
		var TARGET_PATH = path.resolve('uploads/');
		var IMAGE_TYPES = ['image/jpeg', 'image/png'];
		
		var number=f1.number;
	
		var data={
			name:'',
			desc:'',
			base_price:'',
			owner:'',
			img:'',
			auction_id:'',
			verified:'no'
		};
		
		var owner_id='';
			owner_id=jwt.verify(f1.user_id,'RavinderSingh3104');
			
			for(var x=1;x<=number;x++)
			{
				var object="image"+x;
				var size=f2[object].size;
				var type = f2[object].type;
				var extension = type.split('/').pop();
				if(size>3000000 || IMAGE_TYPES.indexOf(type) == -1)   // greater than 3 mb
				{
							res.redirect('/error');
							return;
				}
			}
			//store images first
			for(var x=1;x<=number;x++)
			{
				(function(x){
						var object="name"+x;
						data.name=f1[object];
						object="image"+x;
						var temppath=f2[object].path;
						targetName = data.name+owner_id.ac_id + f1.auction_id+'.' + extension;
						targetPath = path.join(TARGET_PATH, targetName);
							var c=fs.readFileSync(temppath );
							fs.writeFileSync(targetPath,c);
				})(x);
			}
			
			var flag=0;
			for(var x=1;x<=number;x++)
			{
				var object="name"+x;
				data.name=f1[object];
				object="desc"+x;
				data.desc=f1[object];
				object="price"+x;
				data.base_price=f1[object];
				data.owner=mongoose.Types.ObjectId(owner_id.ac_id);
				data.auction_id=mongoose.Types.ObjectId(f1.auction_id);
				targetName = data.name+owner_id.ac_id + f1.auction_id+'.' + extension;
				targetPath = path.join(TARGET_PATH, targetName);
				data.img=targetName;
				var final_data=JSON.stringify(data);  
					var new_product=dbobj(JSON.parse(final_data));
						new_product.save(function (err) {
							if (err) {
								console.error(err); 
							}
					});
					if(x==number)
					{
						res.redirect('/upload_successful');
					}
								
			}
			
		}
 
 module.exports=upload;