var express=require("express");
var bdp=require("body-parser");
var formidable=require("formidable");
var app=express();
var http=require('http').Server(app);
var util=require('util');
var register=require('./register');
var signin=require('./signin');
var getAuction=require('./getAuctions');
var vp=require('./verify_product');
var store_data=require('./store_data');
var getAucRes=require('./getAuctionResults.js');
var cr_tables_auc=require('./create_tables_auction');
var getAuctionDetails=require('./getAuctionDetails');
var del_auc=require('./deleteAuction');
var en_auc=require('./enable_auction');
var getAllProducts=require('./getAllProducts');
var ch_up_auc=require('./change_uploading');
var start_stop_auc=require('./start_stop');
var lpu=require('./list_products_user');
var getOwner=require('./getOwner');
var ppu=require('./purchased_products_user');
var ch_up=require('./check_uploading');
var gt=require('./get_time');
var ch_st=require('./check_start');
var timeout=require('./timeout_handle');
var dis_auc=require('./disable_auction');
var send_array_to_localstorage=require('./send_array');
app.use(express.static(__dirname+'/views'));
app.use(express.static(__dirname+'/uploads'));
var cu=require('./checkusername');
var jwt=require('jsonwebtoken');
var createAuc=require('./createAuction');
var io = require('socket.io')(http);
var formatTime=require('./format_JoinTime');
var globalvar=require('./globals');

var all_users=[];

var bid_data_to_transmit=globalvar;

app.use(bdp.json()); 

app.get('/error',function(req,res){
	res.sendFile(__dirname+"/views/error.html");
});

io.sockets.on('connection', function(socket){
	
	socket.on('new_user',function(msg){
		var now = new Date();
		formatted_time=formatTime(now);
		all_users.push({'id':msg.id,'name':msg.name,'join_time':formatted_time});
		io.emit('total_users_online',JSON.stringify(all_users));
		io.emit('new_conn','yes');
		send_array_to_localstorage(io,socket,msg.id,msg.auction_id,formatted_time);
	});
	
	socket.on('timeout',function(data){
		timeout(io,socket,data,all_users);
	});
	
	socket.on('new_bid',function(data){
		new_bid=data;
		console.log("BID RIGHT NOW: "+ JSON.stringify(bid_data_to_transmit));
		
		var result = all_users.filter(function( all_users ) {
			return all_users.id == socket.id;
		});
		
		if(parseInt(new_bid) > parseInt(bid_data_to_transmit.value))
		{
			bid_data_to_transmit.value=new_bid;
			bid_data_to_transmit.user=result[0].name;
			io.emit('bid_status',JSON.stringify(bid_data_to_transmit));		
		}
		else
		{
			console.log("in");
			io.sockets.connected[socket.id].emit('less_bid','no');		
		}
	
	});
	
	socket.on('disconnect',function(){
		var result = all_users.filter(function( all_users ) {
			return all_users.id == socket.id;
		});
		var index = all_users.indexOf(result);
		all_users.splice(index,1);
			io.emit('total_users_online',JSON.stringify(all_users));
					io.emit('left_conn','yes');
	});
	
});

app.get('/',function(req,res){
	
						res.sendFile("index.html");
});

app.post('/store',function(req,res){
	var form=new formidable.IncomingForm();
	
	form.parse(req, function(err, fields, files) {
		var fi=JSON.stringify(fields);
		var fil=JSON.stringify(files);
			var token = jwt.sign({ fields:fi,files:fil  }, 'RavinderSingh3104');
		store_data(req,token,res);
	});
});

app.post('/sign',function(req,res){
		var rdata;
		console.log(req.body);
		rdata=req.body;
		signin(rdata,req,res);
	
});


app.post('/getAuctionResults',function(req,res){
		getAucRes(req,res,req.body);
});


app.get('/list_auctions',function(req,res){
	getAuction(req,res,'yes');
});


app.get('/finish',function(req,res){
	res.sendFile(__dirname+"/views/auction_finish.html");
});

app.get('/disable_auctions',function(req,res){
	getAuction(req,res,'yes');
});


app.post('/create_tables_auction',function(req,res){
	
	getAuctionDetails(req,res,req.body.auc_id);
//	cr_tables_auc(req,res,req.body.auc_id);
	
});

app.get('/list_auctions_admin',function(req,res){
	getAuction(req,res,'');
});

app.get('/list_products_admin',function(req,res){
	getAllProducts(req,res,'no');
});

app.get('/ad_panel',function(req,res){
	res.sendFile(__dirname+'/views/ad_panel.html');
});


app.get('/uploading_closed',function(req,res){
	res.sendFile(__dirname+'/views/closed.html');
});

app.get('/not_started',function(req,res){
	res.sendFile(__dirname+'/views/notstarted.html');
});


app.get('/upload_successful',function(req,res){
	res.sendFile(__dirname+'/views/success.html');
});


app.get('/verify_products',function(req,res){
	res.sendFile(__dirname+'/views/verify_p.html');
});


app.get('/your_products',function(req,res){
	res.sendFile(__dirname+'/views/your_p.html');
});


app.post('/check_uploading',function(req,res){
	ch_up(req,res,req.body.auc_id);
});

app.post('/get_time',function(req,res){
	gt(req,res,req.body.auc_id);
});

app.post('/verify_product',function(req,res){
	vp(req,res,req.body.id);
});

app.post('/list_products_user',function(req,res){
	lpu(req,res,req.body.u_id);
});

app.post('/purchased_products_user',function(req,res){
	ppu(req,res,req.body.u_name);
});

app.post('/get_owner',function(req,res){
	getOwner(req,res,req.body.u_id);
});

app.post('/check_start',function(req,res){
	ch_st(req,res,req.body.auc_id);
});

app.post('/enable_auction',function(req,res){
	en_auc(req,res,req.body.auc_id);
});


app.post('/delete_auc',function(req,res){
	del_auc(req,res,req.body.auc_id);
});


app.post('/change_uploading',function(req,res){
	ch_up_auc(req,res,req.body.auc_id,req.body.str);
});

app.post('/start_stop',function(req,res){
	start_stop_auc(req,res,req.body.auc_id,req.body.str);
});


app.post('/do_disable_auction',function(req,res){
	dis_auc(req,res,req.body.auc_id);
});

app.post('/ad_login',function(req,res){
		var rdata;
		rdata=req.body;
		if(rdata.name=='admin' && rdata.password=='admin')
		{
					var tp= jwt.sign({ admin:'logged' }, 'RavinderSingh3104');
					res.send({msg:'',location:'panel.html',t:tp});
		}
		else
		{
			res.send({t:'',msg:'Wrong Credentials',location:''});
		}
		
});

app.get('/add',function(req,res){
					res.sendFile(__dirname+'/views/main.html');	
});

app.get('/main',function(req,res){
						res.sendFile(__dirname+'/views/options.html');	
});

app.get('/show',function(req,res){
					console.log('in new node req');
					session.startSession(req, res, function(){
						//LOGGED IN USER
						res.redirect('main.html');
				});
});
	
app.post('/createAuction',function(req,res){
		var data;
		data=req.body;
		var tp= jwt.sign({ details:data }, 'RavinderSingh3104');
		createAuc(req,tp,res);
});

app.post('/checkuser', function(req, res){
	cu(req.body,res);
});

app.post('/register',function(req,res){
		var data;
		data=req.body;
		register(req,data,res);
});

app.get('/auction',function(req,res){
		res.sendFile(__dirname+'/views/auction.html');	
});

app.get('/admin',function(req,res){
						res.sendFile(__dirname+'/views/ad.html');	
});

http.listen(8000,function(){
	console.log("Server ready on port 8000.");
});