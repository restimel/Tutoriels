if(window.Worker && window.MessageChannel){
	//création du canal de communication
	var channel = new MessageChannel();
	channel.port1.onmessage=function(e){
		alert(e.data);
	};

	//création du worker
	var w=new Worker("worker.js");
	w.onmessage=function(e){ //ce listener ne sera pas utilisé
		alert("Je ne veux pas recevoir de message par ce canal");
	};

	//transfert de port2
	w.postMessage("Voici le port2",[channel.port2]);
	//à partir de maintenant channel.port2 n'est plus utilisable dans ce thread. Il a été transféré
}else{
//le navigateur ne supporte pas ce code
	alert("Désolé votre navigateur ne supporte pas les workers ou les message-channel ! ☹");
}
