//Création d'une zone d'affichage
var elem=document.createElement("output");
document.body.appendChild(elem);
elem.textContent="Le jardinier ne travaille pas";
//Création d'un worker
if(window.Worker){
//le navigateur supporte les workers
	var worker=new Worker("worker.js");
	worker.onmessage=function(event){
		elem.textContent=event.data;
	};
}else{
//le navigateur ne supporte pas les workers
	alert("Désolé votre navigateur ne supporte pas les workers ! ☹");
}
