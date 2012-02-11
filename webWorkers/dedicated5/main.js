if(window.Worker){

	var w=new Worker("worker.js");
	w.addEventListener("message",function(event){
		alert("Le worker a répondu :\n"+event.data);
		if(event.data.substr(0,7) === "Bonjour"){
			var nom=prompt("Quel est ton nom ?");
			w.postMessage("L'utilisateur s'appelle : "+nom);
		}
	},false);
	w.addEventListener("error",function(event){
		//detection d'une erreur
		alert("Il a planté ! Son excuse bidon est :\n"+event.message);
	},false);
	w.postMessage("Bonjour");

}else{
	alert("Désolé votre navigateur ne supporte pas les workers ! ☹");
}
