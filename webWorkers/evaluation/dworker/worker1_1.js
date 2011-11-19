self.onmessage=function(e){
	var data=e.data;
	switch(typeof data){
		case "string":
			if(data==="Message #001") postMessage("Response #001");
			else if(data==="Message #003") postMessage({msg:"Response #003",code:3});
			else if(data==="Message #004"){
				createAnError("#004");
			}
			else if(data==="Message #005"){
				onerror=function(e){postMessage("Error");};
				createAnError("#005");
			}
			else if(data==="Message #006"){
				if(e.ports && e.ports[0]) e.ports[0].postMessage("Response #006");
			}
			else if(data==="Message #007"){
				if(typeof self.MessageChannel !== "undefined"){
					var ch=new MessageChannel();
					postMessage("Response #007",[ch.port2]);
					ch.port1.postMessage("Channel #007");
				}
			}
			break;
		case "object":
			if(data.msg==="Message #002" && data.code===2) postMessage("Response #002");
		
	}
}

setTimeout(function(){
	if(typeof XMLHttpRequest !== "undefined"){
		postMessage("XMLHttpRequest");
	}
	if(typeof self.navigator !== "undefined"){
		postMessage("self.navigator");
	}
	if(typeof self.location !== "undefined"){
		postMessage("self.location");
	}
	if(typeof Worker !== "undefined"){
		postMessage("new dedicated-Worker");
	}
	if(typeof SharedWorker !== "undefined"){
		postMessage("new shared-Worker");
	}
},100);
