if(window.Worker){

	//création du worker
	var w=new Worker("./worker.js");

	//réception des messages
	w.addEventListener("message",function(event){
		alert("Le worker a répondu :\n"+event.data);
		if(event.data.substr(0,7) === "Bonjour"){
			var nom=prompt("Quel est ton nom ?");
			w.postMessage("L'utilisateur s'appelle : "+nom);
		}
	},false);

	//gestion des erreurs provenant du worker
	w.addEventListener("error",function(event){
		//detection d'une erreur
		alert("Il a planté ! Son excuse bidon est :\n"+event.message+
			"\n\nFichier défectueux : "+event.filename+
			"\nÀ la ligne : "+event.lineno);
	},false);

	w.postMessage("Bonjour");


}else{
	alert("Désolé votre navigateur ne supporte pas les workers ! ☹");
}
