if(window.Worker){

	var w=new Worker("worker.js");
	w.onmessage=function(event){ //réception d'un message
		alert("Le worker a répondu:\n"+event.data); //lecture du message
		if(event.data.substr(0,7) == "Bonjour"){
		// dans le cas où le message commence par "Bonjour" on demande le nom de l'utilisateur
			var nom=prompt("Quel est ton nom ?");
			w.postMessage("L'utilisateur s'appelle : "+nom);
		}
	};
	w.postMessage("Bonjour"); //envoi d'un message vers le worker

}else{
	alert("Désolé votre navigateur ne supporte pas les workers ! ☹");
}
