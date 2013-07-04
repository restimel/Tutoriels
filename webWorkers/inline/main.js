if(window.Worker){
//le navigateur supporte les workers

	//Création d'un Blob
	var content = ["onmessage = function(e){ postMessage('je réponds au message : ' + e.data); };"], //code du worker
		blob=null;
	if(window.Blob){
		blob = new Blob(content);
	}else{
		alert("Désolé votre navigateur ne semble pas supporter les Blob ☹");
	}

	if(blob){
		//le navigateur supporte les Blob

		//création de l'URL
		var compatibleURL = window.URL || window.webkitURL || window.MozURL || window.mozURL || window.oURL || window.OURL || window.MsURL || window.msURL;
			
		if(!compatibleURL){
			alert("Désolé votre navigateur ne semble pas supporter la création d'URL à partir d'objet ☹");
		}else{
			var blobUrl = compatibleURL.createObjectURL(blob); //création de l'url à partir de l'objet


			var worker = new Worker(blobUrl); //création du worker
			worker.onmessage=function(e){
				alert(e.data);
			};
			worker.postMessage("Bonjour");
		}
	}



}else{
//le navigateur ne supporte pas les workers
	alert("Désolé votre navigateur ne supporte pas les workers ! ☹");
}
