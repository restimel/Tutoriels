var w=new Worker("worker.js");
w.addEventListener("message",function(event){ //réception d'un message avec addEventListener
	alert("Le worker a répondu:\n"+event.data);
	if(event.data.substr(0,7) == "Bonjour"){
		var nom=prompt("Quel est ton nom ?");
		w.postMessage("L'utilisateur s'appelle : "+nom);
	}
},false);
w.postMessage("Bonjour");

