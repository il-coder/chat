var p = document.getElementById("demo");
var socket;
var u_name;

function connect()
{
	var port=document.getElementById("port").value;
	socket = new WebSocket('wss://connect.websocket.in/v3/'+450+'?apiKey=NxcDNyx8dSmaMAVSGc0jLCXSYXBEwxdmRBIdZUnuannYKQKhyXRIseij7wvO');

	socket.onopen = function(event) {
		u_name=document.getElementById("name").value;
		p.innerHTML += '<b>You are connected on channel '+port + '</b><br>';
   		console.log("Connection established successfully");
		var msg={
		type:"conn",
		text:u_name,
		date:Date.now(),
		name:u_name
		};
		socket.send(JSON.stringify(msg));
   		document.getElementById("send").disabled=false;
		document.getElementById("mf").disabled=false;
		document.getElementById("cancel").disabled=false;
		document.getElementById("connectbtn").disabled=true;
		document.getElementById("port").disabled=true;
		document.getElementById("name").disabled=true;
	};

	document.getElementById("send").onclick=function(){
		var ms = mf.value;
		if(ms=="")
		{
			alert("No message to be sent");
		}
		else
		{
			var msg={
				type:"message",
				text:ms,
				date:Date.now(),
				name:u_name
				};
			var time= new Date(msg.date);
			var timeStr = time.toLocaleTimeString();
			p.innerHTML += '<b>You</b> ('+timeStr+') : ' + ms + '<br>';	
			socket.send(JSON.stringify(msg));
			mf.value="";
		}
	};

	socket.onmessage = function(event) {
		var text = "";
 		var msg = JSON.parse(event.data);
		var time = new Date(msg.date);
  		var timeStr = time.toLocaleTimeString();
		if(msg.type=="conn")
		{
			p.innerHTML += '<b>(' + timeStr + ') '+msg.text + ' joined on this channel.</b><br>';
		}
		else if(msg.type=="disconn")
		{
			p.innerHTML += '<b>(' + timeStr + ') '+msg.text + ' disconnected from this channel.</b><br>';	
		}
		else if(msg.type=="message")
		{
  			p.innerHTML += '<b>'+msg.name+ '</b> (' + timeStr + ') :' + msg.text + '<br>';
		}
	};

	document.getElementById("cancel").onclick=function() {
		var msg={
			type:"disconn",
			text:u_name,
			date:Date.now(),
			name:u_name
			};
		socket.send(JSON.stringify(msg));
		socket.close();
		document.getElementById("send").disabled=true;
		document.getElementById("mf").disabled=true;
		document.getElementById("cancel").disabled=true;
		document.getElementById("connectbtn").disabled=false;   
		document.getElementById("name").disabled=false;   
		document.getElementById("port").disabled=false;   
	}

	window.onbeforeunload = function () {
		var msg={
			type:"disconn",
			text:u_name,
			date:Date.now(),
			name:u_name
			};
		socket.send(JSON.stringify(msg));
		socket.close();
	}

	socket.onclose = function(event) {
		p.innerHTML += '<b>You are disconnected from channel '+port + '</b><br>';
 		console.log('Disconnected from WebSocket.');
	};
}
