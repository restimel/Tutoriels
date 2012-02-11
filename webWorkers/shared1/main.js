//création du contexte
var elem=document.createElement("output");
elem.value="Log:";
document.body.appendChild(elem);

//utilisation du worker
if(window.SharedWorker){
	var w = new SharedWorker("worker.js"); //création d'un Shared-worker
	w.port.onmessage=function(e){ //Réception d'un message
		elem.innerHTML+="<br />"+e.data;
	};
	w.port.postMessage("Bonjour"); //envoi d'un message
}else{
	elem.textContent="Votre navigateur ne supporte pas les shared-workers ☹";
}
