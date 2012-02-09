//Création d'une zone d'affichage
var elem=document.createElement("div");
elem.textContent="Log :";
document.body.appendChild(elem);

//utilisation du worker
if(window.SharedWorker){
	//Création de workers
	var w1 = new SharedWorker("worker.js","monWorker"); //création d'un worker nommé "monWorker"
	w1.port.onmessage=function(e){
		elem.innerHTML+="<br>W1 "+e.data;
	};

	var w2 = new SharedWorker("worker.js","worker2"); //création d'un worker nommé "autreWorker"
	w2.port.onmessage=function(e){
		elem.innerHTML+="<br>W2 "+e.data;
	};

	var w3 = new SharedWorker(null,"monWorker"); //création d'un worker nommé "monWorker"
	w3.port.onmessage=function(e){
		elem.innerHTML+="<br>W3 "+e.data;
	};

	w1.port.postMessage("Bonjour");
	w2.port.postMessage("Bonjour");
	w3.port.postMessage("Bonjour");
	
}else{
	elem.textContent="Votre navigateur ne supporte pas les shared-workers ☹";
}
