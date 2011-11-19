//Création d'une zone d'affichage
var elem=document.createElement("output");
elem.textContent="Log :";
document.body.appendChild(elem);

if(window.SharedWorker){

	var w = new SharedWorker("./worker.js");
	w.port.addEventListener("message",function(e){ //réception d'un message
		elem.innerHTML+="<br>"+e.data;
	},false);
	//important pour démarrer la réception des messages sur ce port
	w.port.start();
	
}else{
	elem.textContent="Votre navigateur ne supporte pas les shared-workers ☹";
}
