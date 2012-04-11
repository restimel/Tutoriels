//création d'une zone d'échange
var input = document.createElement("input");
input.disabled = true;
input.onchange = function(){
	port.postMessage(this.value);
	this.value = "";
};
input.placeholder = "Texte à envoyer";
document.body.appendChild(input);

//création d'une zone d'affichage
var output = document.createElement("output");
output.value = "en attente d'un interlocuteur (ouvrez une autre page avec la même adresse)";
document.body.appendChild(output);

if(window.SharedWorker && window.MessageChannel){
	var port;

	//création du worker
	var w = new SharedWorker("worker.js");
	w.port.onmessage = function(e){
		if(e.ports && e.ports.length){
			input.disabled = false;

			port = e.ports[0]; //on repère le port transféré
			output.value = "";
			port.onmessage = function(e){ // on écoute sur ce canal
				output.value = e.data;
			};

			w.terminate(); //le worker n'est maintenant plus utile
		}
	};

}else{
//le navigateur ne supporte pas ce code
	alert("Désolé votre navigateur ne supporte pas les shared-workers ou les message-channel ! ☹");
}
