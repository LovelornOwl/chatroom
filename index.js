(function(){
	var element = function(selector){
		return document.querySelector(selector);
	},
	// Get elements
	status = element('.status'),
	messages = element('.messages'),
	textarea = element('.chat textarea'),
	submitbtn = element('.submitbtn'),

	StatusDefault = status.textContent,

	setStatus = function(s){
		status.textContent = s;

		if(s !== StatusDefault){
			var delay = setTimeout(function(){
				setStatus(StatusDefault);
			}, 3000);
		}
	};

	var socket = io.connect('http://127.0.0.1:3000');
	if(socket !== undefined){
		// Output
		socket.on('output', function(data){
			if(data.length){
				for(var x =0;x < data.length;x=x+1){
					var message =document.createElement('div');
					message.setAttribute('class','chat-message');
					message.textContent = data[x].date + ': ' + data[x].message;
					messages.appendChild(message);
					messages.insertBefore(message, messages.firstChild);
				}
			}
		});
	}

	// Status
	socket.on('status', function(data){
		setStatus((typeof data === 'object')? data.message: data);

		if(data.clear === true){
			textarea.value = '';
		}
	});

	var getDate = function getDateTime() {
	    var now     = new Date(); 
	    var year    = now.getFullYear();
	    var month   = now.getMonth()+1; 
	    var day     = now.getDate();
	    var hour    = now.getHours();
	    var minute  = now.getMinutes();
	    var second  = now.getSeconds(); 
	    if(month.toString().length == 1) {
	        var month = '0'+month;
	    }
	    if(day.toString().length == 1) {
	        var day = '0'+day;
	    }   
	    if(hour.toString().length == 1) {
	        var hour = '0'+hour;
	    }
	    if(minute.toString().length == 1) {
	        var minute = '0'+minute;
	    }
	    if(second.toString().length == 1) {
	        var second = '0'+second;
	    }   
	    var dateTime = year+'/'+month+'/'+day+' '+hour+':'+minute+':'+second;   
	    return dateTime;
	};
	// Keydown Event
	textarea.addEventListener('keydown', function(event){
		var self = this;

		if(event.which === 13 && event.shiftKey == false){
			socket.emit('input', {
				message: self.value,
				date:getDate()
			});

			event.preventDefault();
		}
	});

	submitbtn.addEventListener("click",function(e){
		message = textarea.value;

		socket.emit('input', {
				message: message,
				date:getDate()
		});
	
		},false);
})();