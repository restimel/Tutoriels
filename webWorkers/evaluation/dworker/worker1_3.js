self.addEventListener("message",function(e){
	var data=e.data;
	switch(data){
		case "Message #010":
			postMessage("Response #010");
			break;
		case "Message #011":
			createAnError("Response #011");
			break;
		case "Message #012":
			addEventListener("error",function(e){postMessage("Error #012");},false);
			createAnError("Response #012");
			break;
	}
},false);

setTimeout(function(){
if(typeof self.importScripts !== "undefined"){
	postMessage("importScripts");
	self.compteur=1;
	importScripts("compteur2.js");
	if(!self.compteur) postMessage("importScripts_1");
	self.compteur=3;
	importScripts("compteur.js","compteur.js","compteur.js");
	if(!self.compteur) postMessage("importScripts_X");
}
},100);
