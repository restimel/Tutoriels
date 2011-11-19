onmessage=function(e){
	switch(e.data){
		case "create onclose":
			self.onclose=function(e){
				postMessage("self.onclose");
			};
			break;
		case "create Listener close":
			self.addEventListener("close",function(e){
				postMessage("self.addEventListener(close)");
			},false);
			break;
		case "send 2 messages":
			setTimeout(function(e){postMessage("secondMessage");},200);
			postMessage("firstMessage");
			break;
		case "close":
			setTimeout(function(e){postMessage("AfterClose");},200);
			if(self.close){
				postMessage("BeforeClose");
				self.close();
			}
			break;
		case "error":
			postMessage("Error");
			createAnError("Error");
			break;
	}
};
