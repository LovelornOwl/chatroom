var mongo = require('mongodb').MongoClient;
var client = require('socket.io').listen(3000).sockets;

mongo.connect('mongodb://127.0.0.1/mongochat',function(e,db){
	if(e){
		throw e;
	}
	client.on('connection',function(socket){
		var chat = db.collection('chats');
		sendStatus = function(s){
			socket.emit('status',s);
		}

		chat.find().sort({_id:1}).toArray(function(e,res){
			if (e) {
				throw e;
			}
			socket.emit('output',res);
		})

		socket.on('input',function(data){
			var date = data.date;
			var message = data.message;

			if (message=='') {
				sendStatus('啥都不填你发个球啊!')
			}
			else{
				chat.insert({
					message:message,
					date:date
				},function(){
					client.emit('output',[data]);

					sendStatus({
						message:'已发送',
						clear:true
					})
				})
			}
		})
	})
});
