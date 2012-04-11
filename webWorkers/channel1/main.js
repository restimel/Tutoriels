if(window.MessageChannel){
//le navigateur supporte les message-channel

	var channel = new MessageChannel(); //on crée un canal de communication entre channel.port1 et channel.port2

	channel.port1.onmessage=function(e){ //on écoute sur le port1
		alert(e.data);
	};

	channel.port2.postMessage("Bonjour"); //on envoie un message dans le port2

}else{
//le navigateur ne supporte pas les message-channel
	alert("Désolé votre navigateur ne supporte pas les message-channel ! ☹");
}
