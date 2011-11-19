onconnect=function(e){
	var port=e.ports[0];
	port.onmessage=function(e){
		switch(e.data){
			case "create onclose":
				self.onclose=function(e){
					port.postMessage("self.onclose");
				};
				break;
			case "create Listener close":
				self.addEventListener("close",function(e){
					port.postMessage("self.addEventListener(close)");
				},false);
				break;
			case "send 2 messages":
				setTimeout(function(e){port.postMessage("secondMessage");},200);
				port.postMessage("firstMessage");
				break;
			case "self.close":
				setTimeout(function(e){port.postMessage("AfterClose");},200);
				if(self.close){
					port.postMessage("BeforeClose");
					self.close();
				}
				break;
			case "create port.onclose":
				port.onclose=function(e){
					port.postMessage("port.onclose");
				};
				break;
			case "create Listener port.close":
				port.addEventListener("close",function(e){
					port.postMessage("port.addEventListener(close)");
				},false);
				break;
			case "port.close":
				setTimeout(function(e){port.postMessage("AfterClose");},200);
				if(port.close){
					port.postMessage("BeforeClose");
					port.close();
				}
			case "error":
				port.postMessage("Error");
				createAnError("Error");
				break;
		}
	};
};
