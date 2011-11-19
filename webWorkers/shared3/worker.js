var num=0;
addEventListener("connect",function(e){
	var port = e.ports[0];
	port.postMessage("Pret #"+num);
	num++;
	port.addEventListener("message",function(e){
		port.postMessage("Réponse à "+e.data);
	},false);
	//important pour démarrer la réception des messages sur ce port
	port.start();
},false);

