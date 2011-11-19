var num=0;
onconnect=function(e){ //initialisation d'un worker
	var port = e.ports[0];
	port.postMessage("pret #"+num); //envoi d'un message
	port.onmessage=function(event){ //réception d'un message
		port.postMessage("réponse à "+event.data);
	};
	num++;
};
