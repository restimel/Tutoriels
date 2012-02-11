function dialogue(event){
	if(event.data === "Bonjour"){
		throw "J'aime pas dire bonjour"; //on crée volontairement une erreur
	}
}
addEventListener("message",dialogue,false);

addEventListener("error",function(e){
	//détection d'une erreur dans le worker
	postMessage("J'ai rencontré une erreur : "+e.message);
},false);
