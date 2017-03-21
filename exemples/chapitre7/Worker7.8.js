var num = 0;

//nouvelle connexion
onconnect = function(e) {
	var port = e.ports[0];
	port.postMessage("pret #" + num);
	num++;
	
	//réception des messages
	port.onmessage = function(event) {
		port.postMessage("réponse à " + event.data);
	};
};