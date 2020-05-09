var p = document.getElementById("demo");
var socket;
var u_name;
var port;
var c_id;
var flag=0;

window.onload=function(){
	var port_s=localStorage.getItem('port');
	var name_s=localStorage.getItem('name_c');
	var id_s= localStorage.getItem('id');
	if(port_s!=null)
	{
		document.getElementById("connectbtn").disabled=true;
		document.getElementById("port").disabled=true;
		document.getElementById("name").disabled=true;
		document.getElementById("port").value=port_s;
		document.getElementById("name").value=name_s;
		c_id=id_s;
		flag=1;
		connect();
	}
}

function randomStr(len, arr) { 
            var ans = ''; 
            for (var i = len; i > 0; i--) { 
                ans +=  
                  arr[Math.floor(Math.random() * arr.length)]; 
            } 
            return ans; 
      } 

function connect()
{
	port=document.getElementById("port").value;
	socket = new WebSocket('wss://connect.websocket.in/v3/'+port+'?apiKey=NxcDNyx8dSmaMAVSGc0jLCXSYXBEwxdmRBIdZUnuannYKQKhyXRIseij7wvO');

	u_name=document.getElementById("name").value;
	document.getElementById("connectbtn").disabled=true;
	document.getElementById("port").disabled=true;
	document.getElementById("name").disabled=true;

	socket.onopen = function(event) {
		if(flag==0)
		{
			c_id = randomStr(20,u_name+"123456");
			p.innerHTML += '<b><div class="brdcst">You are connected on channel '+port + '</div></b><br>';
			localStorage.setItem('name_c',u_name);
			localStorage.setItem('port',port);
			localStorage.setItem('id',c_id);
   			console.log("Connection established successfully");
			var msg={
				type:"conn",
				text:u_name,
				date:Date.now(),
				name:u_name,
				id:c_id
				};
			socket.send(JSON.stringify(msg));
		}
		else if(flag==1)
		{
			p.innerHTML += '<b><div class="brdcst">You are reconnected on channel '+port + '</div></b><br>';
			console.log("Connection established successfully");
			var msg={
				type:"reconn",
				text:u_name,
				date:Date.now(),
				name:u_name,
				id:c_id
				};
			socket.send(JSON.stringify(msg));	
		}
   		document.getElementById("send").disabled=false;
		document.getElementById("mf").disabled=false;
		document.getElementById("cancel").disabled=false;
	};

	document.getElementById("send").onclick=function(){
		var mf= document.getElementById("mf");
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
			p.innerHTML += '<div class="sent"><b>You ('+timeStr+') : </b><br>' + ms + '</div><br>';	
			socket.send(JSON.stringify(msg));
			mf.value="";
			document.getElementById("demo").scrollTop = document.getElementById("demo").scrollHeight;
		}
	};	

	socket.onmessage = function(event) {
		var text = "";
 		var msg = JSON.parse(event.data);
		var time = new Date(msg.date);
  		var timeStr = time.toLocaleTimeString();
		if(msg.type=="conn")
		{
			p.innerHTML += '<b><div class="brdcst">(' + timeStr + ') '+msg.text + ' joined on this channel.</div></b><br>';
			var msg1={
				type:"users",
				text:u_name,
				id:msg.id,
				date:Date.now(),
				name:u_name
				};
			socket.send(JSON.stringify(msg1));
		}
		else if(msg.type=="disconn")
		{
			p.innerHTML += '<b><div class="brdcst">(' + timeStr + ') '+msg.text + ' disconnected from this channel.</div></b><br>';	
		}
		else if(msg.type=="users")
		{
			if(msg.id==c_id)
			{
				p.innerHTML += '<b><div class="brdcst">(' + timeStr + ') '+msg.text + ' already connected on this channel.</div></b><br>';		
			}
		}
		else if(msg.type=="reconn")
		{
			p.innerHTML += '<b><div class="brdcst">(' + timeStr + ') '+msg.text + ' reconnected on this channel.</div></b><br>';
			var msg1={
				type:"users",
				text:u_name,
				id:msg.id,
				date:Date.now(),
				name:u_name
				};
			socket.send(JSON.stringify(msg1));	
		}
		else if(msg.type=="message")
		{
  			p.innerHTML += '<div class="mesg"><b>'+msg.name+ ' (' + timeStr + ') : </b><br>' + msg.text + '</div><br>';
		}
		document.getElementById("demo").scrollTop = document.getElementById("demo").scrollHeight;
	};

	document.getElementById("cancel").onclick=function() {
		var msg={
			type:"disconn",
			text:u_name,
			date:Date.now(),
			name:u_name
			};
		flag=0;
		socket.send(JSON.stringify(msg));
		localStorage.removeItem('name_c');
		localStorage.removeItem('port');
		localStorage.removeItem('id');
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
		p.innerHTML += '<b><div class="brdcst">You are disconnected from channel '+port + '</div></b><br>';
		document.getElementById("demo").scrollTop = document.getElementById("demo").scrollHeight;
		document.getElementById("connectbtn").disabled=false;   
		document.getElementById("cancel").disabled=true;   
 		console.log('Disconnected from WebSocket.');
	};
}

function do_nothing()
{
}