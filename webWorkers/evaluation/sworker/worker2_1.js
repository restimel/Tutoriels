onconnect=function(e){
	var port=e.ports[0];
	port.onmessage=function(e){
		var data=e.data;
		if(typeof data === "string"){
			switch(data){
				case "Message #101":
					port.postMessage("Response #101");
					break;
				case "Message #103":
					port.postMessage({msg:"Response #103",code:3});
					break;
				case "Message #104":
					createAnError("#104");
					break;
				case "Message #105":
					port.onerror=function(e){port.postMessage("port Error");};
					createAnError("#105");
					break;
				case "Message #106":
					port.onerror=null;
					self.onerror=function(e){port.postMessage("self Error");};
					createAnError("#106");
					break;
				case "Message #107":
					if(e.ports && e.ports[0]) e.ports[0].postMessage("Response #107");
					break;
				case "Message #108":
					if(typeof self.MessageChannel !== "undefined"){
						var ch=new MessageChannel();
						port.postMessage("Response #108",[ch.port2]);
						ch.port1.postMessage("Channel #108");
					}
					break;
			}
		}else{
			if(data.msg==="Message #102" && data.code===2) port.postMessage("Response #102");
		}
	}

	setTimeout(function(){
		if(typeof XMLHttpRequest !== "undefined"){
			port.postMessage("XMLHttpRequest");
		}
		if(typeof self.navigator !== "undefined"){
			port.postMessage("self.navigator");
		}
		if(typeof self.location !== "undefined"){
			port.postMessage("self.location");
		}
		if(typeof Worker !== "undefined"){
			port.postMessage("new dedicated-Worker");
		}
		if(typeof SharedWorker !== "undefined"){
			port.postMessage("new shared-Worker");
		}
	},100);
}
