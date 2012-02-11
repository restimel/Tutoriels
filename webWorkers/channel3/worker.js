var port=null;
onconnect=function(e){
	var port2=e.ports[0];
	if(!port){ //il s'agit de la première connexion à ce worker
		port=port2;
	}else{ //une autre page est déjà connectée à ce worker
		var ch=new MessageChannel();
		//transfert des ports à chaque page
		port.postMessage("",[ch.port1]);
		port2.postMessage("",[ch.port2]);
	}
};
