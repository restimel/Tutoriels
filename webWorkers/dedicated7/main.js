if(window.Worker){
	//préparation pour l'affichage
	var elem = document.createElement("output");
	elem.value = "en cours de création";
	document.body.appendChild(elem);
	
	// initialisation du worker
	var w=new Worker("worker.js");

	//ajout d'un listener
	w.addEventListener("message", function(event){
		elem.value="Le worker a déjà fait "+event.data+" tours";
	});

	// au bout d'une seconde, on arrête le worker
	setTimeout(function(){
	        w.terminate();
		document.body.appendChild(document.createTextNode("Worker Éliminé"));
	},1000);

}else{
	alert("Désolé votre navigateur ne supporte pas les workers ! ☹");
}

