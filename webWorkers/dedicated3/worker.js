function reponse(event){
	if(event.data == "Bonjour"){
		postMessage("Bonjour, je suis un worker");
	}else{
		postMessage("Maintenant je sais que tu es "+event.data.substr(26)+" !");
	}
}
addEventListener("message",reponse,false); //réception d'un message avec addEventListener

