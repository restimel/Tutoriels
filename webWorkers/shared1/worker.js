var num = 0;
onconnect = function(e){ //initialisation d'un worker
	var port = e.ports[0];
	port.postMessage("pret #"+num); //envoi d'un message
	num++;

	port.onmessage = function(event){ //réception d'un message depuis ce port
		port.postMessage("réponse à "+event.data);
	};

};
