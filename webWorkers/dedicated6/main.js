if(window.Worker){

	var w=new Worker("worker.js");
	w.onmessage=function(event){ //réception d'un message
		alert("Avec succès:\n"+event.data); //lecture du message
		console.debug(event.data);
		console.log(event.data instanceof test); //pour vérifier le type (pour l'objet construit)
	};
	w.onerror=function(event){ //réception d'une erreur
	alert("Avec erreur:\n"+event.message); //lecture du message
	console.debug(event);
	};
	w.postMessage("debut"); //envoi d'un message vers le worker

}else{
	alert("Désolé votre navigateur ne supporte pas les workers ! ☹");
}

function test(){
	this.a="f";
}
var obj=new test();
console.log(obj instanceof test);
test.prototype.toto=2;