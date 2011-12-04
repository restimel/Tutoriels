if(window.Worker){

	//  initialisation du worker
	var w=new Worker("worker1.js");
	w.addEventListener("message",function(event){
	  alert("j'ai reçu le message suivant :\n"+event.data);
	},false);

	// on envoie un message
	w.postMessage("Bonjour");

}else{
	alert("Désolé votre navigateur ne supporte pas les workers ! ☹");
}
