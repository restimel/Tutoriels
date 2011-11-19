onconnect=function(e){
	var port=e.ports[0];
	port.addEventListener("message",function(e){
		var data=e.data;
		switch(data){
			case "Message #110":
				port.postMessage("Response #110");
				break;
			case "Message #111":
				createAnError("Response #111");
				break;
			case "Message #112":
				self.addEventListener("error",function(e){port.postMessage("Error #112");},false);
				createAnError("Response #112");
				break;
		}
	},false);
	port.start();

	setTimeout(function(){
	if(typeof self.importScripts !== "undefined"){
		port.postMessage("importScripts");
		self.compteur=1;
		importScripts("compteur2.js");
		if(!self.compteur) port.postMessage("importScripts_1");
		self.compteur=3;
		importScripts("compteur.js","compteur.js","compteur.js");
		if(!self.compteur) port.postMessage("importScripts_X");
	}
	},100);
};

