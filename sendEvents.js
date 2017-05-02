 
 
 function send(final_data,token,left_t,socket_id,io)
 {
				console.log("here");
				io.sockets.connected[socket_id].emit('store_data',token);
				io.sockets.connected[socket_id].emit('left_time',left_t);
				io.sockets.connected[socket_id].emit('new_product',final_data);	
 }
 
 module.exports=send;