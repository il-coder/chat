/*
	//OWNER	   : IG SOLUTIONS
	//AUTHOR   : PIYUSH GARG
	//START	   : MAY-2020
*/

var p = document.getElementById("demo");
var socket;
var u_name;
var port;
var c_id;
var flag=0;

window.onload=function(){
	document.getElementById('online').innerHTML = 'You are '+(navigator.onLine?'Online':'Offline');
	setInterval(function(){
		document.getElementById('online').innerHTML = 'You are '+(navigator.onLine?'Online':'Offline');
		if(!navigator.onLine)
			{document.getElementById('overlay').style.display="block";}
		if(navigator.onLine){document.getElementById('overlay').style.display="none";} 
		}, 3000);
	var port_s=localStorage.getItem('port');
	var name_s=localStorage.getItem('name_c');
	var id_s= localStorage.getItem('id');
	if(port_s!=null)
	{
		document.getElementById("connectbtn").disabled=true;
		document.getElementById("port").disabled=true;
		document.getElementById("name").disabled=true;
		document.getElementById("contd").disabled=false;
		document.getElementById("port").value=port_s;
		document.getElementById("name").value=name_s;
		c_id=id_s;
		flag=1;
		connect();
	}
	
	
	var d = new Date();
	var n = d.toDateString();
	p.innerHTML += '<div class="date">'+n+'</div><br>';
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
	document.getElementById("contd").disabled=false;

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
			proc_contd();	
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
			p.innerHTML += '<div class="clearfix"><div class="sent-tr"></div><div class="sent"><b>You ('+timeStr+') : </b><br>' + ms + '</div></div><br>';	
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
  			p.innerHTML += '<div class="clearfix"><div class="mesg-tr"></div><div class="mesg"><b>'+msg.name+ ' (' + timeStr + ') : </b><br>' + msg.text + '</div></div><br>';
		}
		document.getElementById("demo").scrollTop = document.getElementById("demo").scrollHeight;
	};

	/*
	//OWNER	   : IG SOLUTIONS
	//AUTHOR   : PIYUSH GARG
	//START	   : MAY-2020
	*/

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
		//document.getElementById("contd").disabled=true;   
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

function proc_contd()
{
	//var port_s=localStorage.getItem('port');
	//if(port_s!=null)
	{
		document.getElementById("chat").style.display="block";
		document.getElementById("channelselector").style.display="none";
	}
}


function connectstd(n)
{
	document.getElementById("cancel").click();
	setTimeout(function(){ 
	document.getElementById("port").value=n;
	u_name=document.getElementById("name").value;
	if(u_name==0)
	{
		alert("No name entered.");
	}
	else
	{
		flag=0;
		connect();
	}
	},300);
}

function go_back()
{
	document.getElementById("chat").style.display="none";
	document.getElementById("channelselector").style.display="table";
}
function insemoj(tem)
{
	var val1 = document.getElementById("mf").value;
	val1 = val1 + tem.text;
	document.getElementById("mf").value = val1;	
	document.getElementById("emojlist").style.display="block";
}

function emojl()
{
	var port_s=localStorage.getItem('port');
	if(port_s!=null)
	{document.getElementById("emojlist").style.display="block";
	window.onclick = function(event){
 		if (document.getElementById('emojlist').contains(event.target) || document.getElementById('emoji').contains(event.target)){
  		} else{
			document.getElementById("emojlist").style.display="none";
  		}		
	};
	}
}

function saveHistory()
{
  var data = btoa(encodeURIComponent(p.innerHTML));
  var file = new File([data],"chat.igch",{type: "text/plain",});
  var d= new Date;
  var filename =d.toUTCString();
  filename +=".igch";
  	var elem = window.document.createElement('a');
  	elem.href = window.URL.createObjectURL(file);
  	elem.download = filename;        
        document.body.appendChild(elem);
        elem.click();
	URL.revokeObjectURL(elem.href);        
        document.body.removeChild(elem);
}

function uploadFileAccess()
{
	document.getElementById("loadfile").click();	
}

function loadHistory(input)
{
	if (input.files[0])
	{
		var reader = new FileReader();
		reader.onload = function(e) {
			var current = p.innerHTML;
			p.innerHTML = decodeURIComponent(atob(e.target.result));
			p.innerHTML += current; 
			alert("Chat History Loaded Successfully.");
			}
		reader.readAsText(input.files[0]);
	}
}

/*
//OWNER	   : IG SOLUTIONS
//AUTHOR   : PIYUSH GARG
//START	   : MAY-2020
*/